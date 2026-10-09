import { getChatConfig } from '@/lib/chat/config';
import { MAX_BODY_BYTES, StreamSanitizer, isAllowedOrigin, isInjectionAttempt, isOutOfScope, parseChatRequest } from '@/lib/chat/guard';
import { admit, consumeBudget, getStore, visitorId, type Admission } from '@/lib/chat/limits';
import { REDIRECT_MESSAGE, REFUSAL_MESSAGE, buildSystemPrompt } from '@/lib/chat/prompt';
import {
  ClientAbortError,
  NotConfiguredError,
  StreamInterruptedError,
  configuredSecrets,
  getProviderConfigs,
  streamChat,
} from '@/lib/chat/providers';
import { selectKnowledge } from '@/lib/chat/retrieval';
import type { ChatErrorCode, ChatErrorResponse, ChatStreamEvent, ChatTurn } from '@/lib/chat/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Vercel function limit. A streamed answer is capped at 25s by the provider layer.
export const maxDuration = 30;

const NO_STORE = { 'Cache-Control': 'no-store' };
const UNAVAILABLE = "The assistant isn't available right now. You can still reach Akshit through the contact section.";

function fail(status: number, error: ChatErrorCode, message: string, headers: Record<string, string> = {}) {
  return Response.json({ error, message } satisfies ChatErrorResponse, { status, headers: { ...NO_STORE, ...headers } });
}

const LIMIT_MESSAGES: Record<Exclude<Admission, { ok: true }>['reason'], string> = {
  disabled: UNAVAILABLE,
  minute: "You're sending questions quickly. Please wait a minute and try again.",
  hour: "You've reached the hourly question limit. Please try again later.",
  day: "You've reached today's question limit. You can still reach Akshit through the contact section.",
  concurrency: 'Please wait for the current answer to finish.',
};

const encoder = new TextEncoder();
const line = (event: ChatStreamEvent) => encoder.encode(`${JSON.stringify(event)}\n`);

function streamResponse(body: ReadableStream<Uint8Array>) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}

/** A fixed answer (refusal or redirect) in the same stream format, with no model call. */
function cannedResponse(text: string, release: () => Promise<void>) {
  return streamResponse(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(line({ type: 'delta', text }));
        controller.enqueue(line({ type: 'done' }));
        controller.close();
        await release();
      },
    }),
  );
}

export async function POST(req: Request) {
  const config = getChatConfig();
  if (!config.enabled) return fail(503, 'DISABLED', UNAVAILABLE);
  if (!isAllowedOrigin(req.headers)) return fail(403, 'FORBIDDEN', 'Request not allowed.');
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return fail(413, 'TOO_LARGE', 'That message is too long.');

  // Per-visitor limits and the shared kill switch, before reading the body or calling a model.
  const store = getStore();
  const admission = await admit(visitorId(req.headers), config, store);
  if (!admission.ok) {
    if (admission.reason === 'disabled') return fail(503, 'DISABLED', UNAVAILABLE);
    return fail(429, 'RATE_LIMITED', LIMIT_MESSAGES[admission.reason], { 'Retry-After': String(admission.retryAfterSec) });
  }

  let streaming = false;
  try {
    let body: unknown;
    try {
      const raw = await req.text();
      if (raw.length > MAX_BODY_BYTES) return fail(413, 'TOO_LARGE', 'That message is too long.');
      body = JSON.parse(raw);
    } catch {
      return fail(400, 'BAD_REQUEST', 'Invalid request.');
    }

    const parsed = parseChatRequest(body, config.maxMessageChars);
    if (!parsed.ok) return fail(parsed.code === 'TOO_LARGE' ? 413 : 400, parsed.code, parsed.message);
    const { messages } = parsed;

    // Deterministic guardrails: no model call for obvious attacks or clearly unrelated questions.
    if (isInjectionAttempt(messages[messages.length - 1].content)) {
      streaming = true;
      return cannedResponse(REFUSAL_MESSAGE, admission.release);
    }
    if (isOutOfScope(messages)) {
      streaming = true;
      return cannedResponse(REDIRECT_MESSAGE, admission.release);
    }

    if (!getProviderConfigs().length) {
      console.error('[chat] No LLM provider configured. Set GEMINI_API_KEY, GROQ_API_KEY or XAI_API_KEY on the server.');
      return fail(503, 'NOT_CONFIGURED', UNAVAILABLE);
    }
    if (!(await consumeBudget(config, store))) {
      console.warn('[chat] Daily request budget reached (CHAT_DAILY_BUDGET).');
      return fail(503, 'BUDGET_EXHAUSTED', "The assistant has reached today's usage limit. You can still reach Akshit through the contact section.");
    }

    streaming = true;
    return streamResponse(createAnswerStream(req, messages, config, admission.release));
  } finally {
    if (!streaming) await admission.release();
  }
}

function createAnswerStream(
  req: Request,
  messages: ChatTurn[],
  config: ReturnType<typeof getChatConfig>,
  release: () => Promise<void>,
): ReadableStream<Uint8Array> {
  const upstream = new AbortController();
  req.signal?.addEventListener('abort', () => upstream.abort('client'));
  const system = buildSystemPrompt(selectKnowledge(messages).text);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) => {
        try {
          controller.enqueue(line(event));
        } catch {
          // The visitor already disconnected.
        }
      };
      const sanitizer = new StreamSanitizer(configuredSecrets());
      let failure: ChatStreamEvent | null = null;
      let clientGone = false;

      try {
        await streamChat({
          system,
          messages,
          config,
          signal: upstream.signal,
          onText: (delta) => {
            const safe = sanitizer.push(delta);
            if (sanitizer.blocked) upstream.abort('blocked');
            else if (safe) send({ type: 'delta', text: safe });
          },
        });
      } catch (err) {
        if (sanitizer.blocked) {
          // Handled below: the reply is replaced.
        } else if (err instanceof ClientAbortError) {
          clientGone = true;
        } else if (err instanceof StreamInterruptedError) {
          failure = { type: 'error', error: 'INTERRUPTED', message: 'The answer was interrupted. Please try again.' };
        } else if (err instanceof NotConfiguredError) {
          failure = { type: 'error', error: 'NOT_CONFIGURED', message: UNAVAILABLE };
        } else {
          failure = { type: 'error', error: 'UPSTREAM_UNAVAILABLE', message: "I couldn't generate an answer just now. Please try again in a moment." };
        }
      }

      try {
        if (!clientGone) {
          const tail = sanitizer.flush();
          if (sanitizer.blocked) {
            console.warn('[chat] reply discarded by output validation');
            send({ type: 'replace', text: REFUSAL_MESSAGE });
            send({ type: 'done' });
          } else {
            if (tail) send({ type: 'delta', text: tail });
            send(failure ?? { type: 'done' });
          }
          controller.close();
        }
      } catch {
        // Stream already closed by the client.
      } finally {
        await release();
      }
    },
    cancel() {
      upstream.abort('client');
    },
  });
}

export function GET() {
  return fail(405, 'BAD_REQUEST', 'Use POST.', { Allow: 'POST' });
}
