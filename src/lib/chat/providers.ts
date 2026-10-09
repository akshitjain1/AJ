// Server-side LLM provider adapters with streaming. API keys are read from
// process.env here and never leave the server.
//
// Strategy: one model call per question. Candidates are ordered by
// CHAT_PROVIDER_ORDER, and within a provider by the models listed in its
// *_MODEL variable (comma-separated). The next candidate is tried only if the
// current one fails *before producing any text* (HTTP error, timeout, empty
// or malformed stream), and at most CHAT_MAX_ATTEMPTS candidates are tried.
// A failure mid-answer is reported, not retried, so one question never pays
// for two answers. A model that returns 429 or 5xx is skipped for a short
// cooldown so later visitors don't wait on it.

import type { ChatConfig } from './config';
import type { ChatTurn } from './types';

export type ProviderId = 'gemini' | 'groq' | 'xai';

/** One callable candidate: a provider plus one of its models. */
export interface ProviderConfig {
  id: ProviderId;
  apiKey: string;
  model: string;
}

const DEFAULT_MODELS: Record<ProviderId, string> = {
  // "-latest" aliases follow Google's current models, so the defaults keep
  // working when a dated version is retired. Flash-Lite answers first because
  // it is fast and rarely overloaded; full Flash is the backup.
  gemini: 'gemini-flash-lite-latest,gemini-flash-latest',
  groq: 'openai/gpt-oss-120b',
  xai: 'grok-3-mini',
};

/**
 * Reasoning models spend output tokens "thinking" before they answer. For
 * short grounded answers, minimal reasoning is faster and can't run out of budget.
 */
function openAIReasoningParams(model: string): Record<string, string> {
  if (/gpt-oss/i.test(model)) return { reasoning_effort: 'low' };
  if (/qwen3/i.test(model)) return { reasoning_effort: 'none' };
  if (/grok-3-mini/i.test(model)) return { reasoning_effort: 'low' };
  return {};
}

function geminiThinkingConfig(model: string): Record<string, string | number> | undefined {
  if (/^gemini-(1|2)\./.test(model)) return undefined;
  // Measured with the real prompt: thinkingLevel "low" can spend 1,300+ tokens
  // thinking and cut the visible answer short. Lite models accept "minimal"
  // (no thinking). Others reject "minimal", so their thinking gets a small fixed budget.
  return /lite/i.test(model) ? { thinkingLevel: 'minimal' } : { thinkingBudget: 128 };
}

const OPENAI_COMPATIBLE_BASE: Record<Exclude<ProviderId, 'gemini'>, string> = {
  groq: 'https://api.groq.com/openai/v1',
  xai: 'https://api.x.ai/v1',
};

type Env = Record<string, string | undefined>;

const clean = (v: string | undefined) => (v ?? '').trim();

export function getProviderConfigs(env: Env = process.env): ProviderConfig[] {
  const keys: Record<ProviderId, string> = {
    // Common alternative names, so an existing Vercel variable works as-is.
    gemini: clean(env.GEMINI_API_KEY) || clean(env.GOOGLE_GENERATIVE_AI_API_KEY) || clean(env.GOOGLE_API_KEY),
    groq: clean(env.GROQ_API_KEY),
    xai: clean(env.XAI_API_KEY) || clean(env.GROK_API_KEY),
  };
  const models: Record<ProviderId, string> = {
    gemini: clean(env.GEMINI_MODEL) || DEFAULT_MODELS.gemini,
    groq: clean(env.GROQ_MODEL) || DEFAULT_MODELS.groq,
    xai: clean(env.XAI_MODEL) || clean(env.GROK_MODEL) || DEFAULT_MODELS.xai,
  };

  const order = (clean(env.CHAT_PROVIDER_ORDER) || 'gemini,groq,xai')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .map((s) => (s === 'grok' ? 'xai' : s)) as ProviderId[];

  const result: ProviderConfig[] = [];
  for (const id of order.filter((id, i) => keys[id] && order.indexOf(id) === i)) {
    for (const model of models[id].split(',').map((m) => m.trim()).filter(Boolean)) {
      result.push({ id, apiKey: keys[id], model });
    }
  }
  return result;
}

export class ProviderError extends Error {
  readonly provider: ProviderId;
  readonly kind: 'timeout' | 'http' | 'network' | 'empty' | 'malformed';
  readonly status?: number;
  readonly retryAfterSec?: number;

  constructor(provider: ProviderId, kind: ProviderError['kind'], status?: number, retryAfterSec?: number, detail?: string) {
    super(`${provider} ${kind}${status ? ` ${status}` : ''}${detail ? `: ${detail}` : ''}`);
    this.provider = provider;
    this.kind = kind;
    this.status = status;
    this.retryAfterSec = retryAfterSec;
  }
}

export class NotConfiguredError extends Error {}
/** The visitor disconnected or pressed Stop. */
export class ClientAbortError extends Error {}
/** The stream failed after text was already sent to the visitor. */
export class StreamInterruptedError extends Error {}

export interface StreamOptions {
  system: string;
  messages: ChatTurn[];
  maxOutputTokens: number;
  temperature: number;
  signal: AbortSignal;
}

export type StreamFn = (cfg: ProviderConfig, o: StreamOptions) => AsyncIterable<string>;

// ── Transport ────────────────────────────────────────────────────

async function openStream(provider: ProviderId, url: string, headers: Record<string, string>, body: unknown, signal: AbortSignal) {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', ...headers },
      body: JSON.stringify(body),
      signal,
      cache: 'no-store',
    });
  } catch {
    throw new ProviderError(provider, signal.aborted ? 'timeout' : 'network');
  }
  if (!res.ok || !res.body) {
    const retryAfter = Number(res.headers.get('retry-after')) || undefined;
    // The body is for the server log only and is truncated. Providers don't echo keys.
    const detail = (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    throw new ProviderError(provider, 'http', res.status, retryAfter, detail);
  }
  return res;
}

/** Yields the payload of each `data:` line of a server-sent-events body. */
async function* sseData(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split(/\r?\n/);
      buffer = done ? '' : (lines.pop() ?? '');
      for (const line of lines) if (line.startsWith('data:')) yield line.slice(5).trim();
      if (done) return;
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}

/** Parses SSE JSON events, tolerating a few malformed ones before giving up. */
async function* jsonEvents(provider: ProviderId, res: Response): AsyncGenerator<Record<string, unknown>> {
  let malformed = 0;
  for await (const data of sseData(res)) {
    if (!data || data === '[DONE]') continue;
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(data);
    } catch {
      if (++malformed > 3) throw new ProviderError(provider, 'malformed');
      continue;
    }
    if (event.error) {
      const e = event.error as { code?: number; message?: string };
      throw new ProviderError(provider, 'http', typeof e.code === 'number' ? e.code : 500, undefined, String(e.message ?? '').slice(0, 200));
    }
    yield event;
  }
}

async function* streamGemini(cfg: ProviderConfig, o: StreamOptions): AsyncGenerator<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:streamGenerateContent?alt=sse`;
  const thinking = geminiThinkingConfig(cfg.model);
  const res = await openStream(
    'gemini',
    url,
    { 'x-goog-api-key': cfg.apiKey },
    {
      systemInstruction: { parts: [{ text: o.system }] },
      contents: o.messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: {
        temperature: o.temperature,
        // Headroom for "thinking" models, whose reasoning tokens count against this limit.
        maxOutputTokens: o.maxOutputTokens * 2,
        ...(thinking ? { thinkingConfig: thinking } : {}),
      },
    },
    o.signal,
  );
  type Chunk = {
    candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };
  for await (const event of jsonEvents('gemini', res)) {
    const candidate = (event as Chunk).candidates?.[0];
    for (const part of candidate?.content?.parts ?? []) {
      if (!part.thought && part.text) yield part.text;
    }
    if (candidate?.finishReason === 'MAX_TOKENS') console.warn(`[chat] ${cfg.model} hit the output token limit`);
  }
}

async function* streamOpenAICompatible(cfg: ProviderConfig, o: StreamOptions): AsyncGenerator<string> {
  const res = await openStream(
    cfg.id,
    `${OPENAI_COMPATIBLE_BASE[cfg.id as 'groq' | 'xai']}/chat/completions`,
    { Authorization: `Bearer ${cfg.apiKey}` },
    {
      model: cfg.model,
      messages: [{ role: 'system', content: o.system }, ...o.messages],
      temperature: o.temperature,
      // Groq counts the reserved max_tokens against per-minute quotas, so keep headroom small.
      max_tokens: o.maxOutputTokens + 300,
      stream: true,
      ...openAIReasoningParams(cfg.model),
    },
    o.signal,
  );
  type Chunk = { choices?: Array<{ finish_reason?: string | null; delta?: { content?: string | null } }> };
  for await (const event of jsonEvents(cfg.id, res)) {
    const choice = (event as Chunk).choices?.[0];
    if (choice?.delta?.content) yield choice.delta.content;
    if (choice?.finish_reason === 'length') console.warn(`[chat] ${cfg.model} hit the output token limit`);
  }
}

const defaultStream: StreamFn = (cfg, o) => (cfg.id === 'gemini' ? streamGemini(cfg, o) : streamOpenAICompatible(cfg, o));

// ── Orchestration ────────────────────────────────────────────────

const cooldownUntil = new Map<string, number>();
const candidateKey = (c: ProviderConfig) => `${c.id}:${c.model}`;

export interface StreamChatOptions {
  system: string;
  messages: ChatTurn[];
  config: ChatConfig;
  /** Receives raw model text as it arrives. */
  onText: (delta: string) => void;
  /** Aborted when the visitor disconnects or presses Stop. */
  signal: AbortSignal;
  env?: Env;
  stream?: StreamFn;
}

export async function streamChat({
  system,
  messages,
  config,
  onText,
  signal,
  env = process.env,
  stream = defaultStream,
}: StreamChatOptions): Promise<{ provider: ProviderId; model: string }> {
  const configs = getProviderConfigs(env);
  if (!configs.length) throw new NotConfiguredError('No LLM provider configured');

  const now = Date.now();
  const ready = configs.filter((c) => (cooldownUntil.get(candidateKey(c)) ?? 0) <= now);
  const queue = (ready.length ? ready : configs).slice(0, config.maxAttempts);
  const deadline = Date.now() + config.streamDeadlineMs;
  let lastError: unknown = new Error('No provider attempted');

  for (const cfg of queue) {
    if (signal.aborted) throw new ClientAbortError();
    const remaining = deadline - Date.now();
    if (remaining < 2_000) break;

    const attempt = new AbortController();
    const onClientAbort = () => attempt.abort('client');
    signal.addEventListener('abort', onClientAbort);
    const deadlineTimer = setTimeout(() => attempt.abort('deadline'), remaining);
    // Covers both "no first token" and "stream stalled mid-answer".
    let idleTimer = setTimeout(() => attempt.abort('idle'), config.firstTokenTimeoutMs);
    let produced = false;

    try {
      for await (const delta of stream(cfg, {
        system,
        messages,
        maxOutputTokens: config.maxOutputTokens,
        temperature: 0.3,
        signal: attempt.signal,
      })) {
        if (attempt.signal.aborted) break;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => attempt.abort('idle'), config.firstTokenTimeoutMs);
        if (delta) {
          produced = true;
          onText(delta);
        }
      }
      if (attempt.signal.aborted) throw new Error(String(attempt.signal.reason));
      if (!produced) throw new ProviderError(cfg.id, 'empty');
      return { provider: cfg.id, model: cfg.model };
    } catch (err) {
      if (signal.aborted) throw new ClientAbortError();
      const error =
        attempt.signal.aborted && !(err instanceof ProviderError)
          ? new ProviderError(cfg.id, 'timeout', undefined, undefined, String(attempt.signal.reason))
          : err;
      if (error instanceof ProviderError) {
        if (error.status === 429) cooldownUntil.set(candidateKey(cfg), Date.now() + (error.retryAfterSec ?? 30) * 1000);
        else if (error.status && error.status >= 500) cooldownUntil.set(candidateKey(cfg), Date.now() + 60_000);
      }
      console.error(`[chat] provider "${cfg.id}" (${cfg.model}) failed: ${(error as Error).message}`);
      if (produced) throw new StreamInterruptedError((error as Error).message);
      lastError = error;
    } finally {
      clearTimeout(deadlineTimer);
      clearTimeout(idleTimer);
      signal.removeEventListener('abort', onClientAbort);
    }
  }
  throw lastError;
}

export function resetProviderCooldowns() {
  cooldownUntil.clear();
}

/** All configured key values, so replies can be checked for leaks. */
export function configuredSecrets(env: Env = process.env): string[] {
  return Array.from(new Set(getProviderConfigs(env).map((c) => c.apiKey)));
}
