// Input validation, abuse control, and reply validation for /api/chat.
// Security-sensitive rules are enforced here in code, not just in the prompt.

import { canonicalUrl, knowledgeBase, tokenize, type KnowledgeBase } from './knowledge';
import { PROMPT_CANARY } from './prompt';
import { CHAT_LIMITS, type ChatErrorCode, type ChatTurn } from './types';

// ── Request validation ───────────────────────────────────────────

export const MAX_BODY_BYTES = 32 * 1024;
const MAX_ASSISTANT_CHARS = 1500;
// Strip control characters (except tab and newline) plus invisible Unicode
// format characters: zero-width, bidi overrides, BOM.
const CONTROL_CHARS = new RegExp(
  `[${[
    [0x00, 0x08], [0x0b, 0x1f], [0x7f, 0x7f], [0x200b, 0x200f], [0x2028, 0x202e], [0x2060, 0x2064], [0xfeff, 0xfeff],
  ]
    .map(([a, b]) => `${String.fromCharCode(a)}-${String.fromCharCode(b)}`)
    .join('')}]`,
  'g',
);

type ParseResult =
  | { ok: true; messages: ChatTurn[] }
  | { ok: false; code: ChatErrorCode; message: string };

export function parseChatRequest(body: unknown, maxMessageChars: number = CHAT_LIMITS.maxMessageChars): ParseResult {
  const bad = (message: string): ParseResult => ({ ok: false, code: 'BAD_REQUEST', message });
  if (!body || typeof body !== 'object' || Array.isArray(body) || !Array.isArray((body as { messages?: unknown }).messages)) {
    return bad('Invalid request.');
  }
  // Only `messages` is accepted, so a visitor can't smuggle in a model, token limit or other setting.
  if (Object.keys(body).some((k) => k !== 'messages')) return bad('Invalid request.');
  const raw = (body as { messages: unknown[] }).messages;
  if (raw.length === 0 || raw.length > 50) return bad('Invalid conversation.');

  const turns: ChatTurn[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') return bad('Invalid message.');
    const { role, content } = m as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return bad('Invalid message.');
    turns.push({ role, content: content.replace(CONTROL_CHARS, '').trim() });
  }

  const last = turns[turns.length - 1];
  if (last.role !== 'user' || !last.content) return bad('Please enter a question.');
  if (last.content.length > maxMessageChars) {
    return { ok: false, code: 'TOO_LARGE', message: `Please keep questions under ${maxMessageChars} characters.` };
  }

  // Bound the history, start it on a user turn, and merge same-role runs so
  // every provider sees a clean user/assistant alternation.
  const recent = turns.slice(-CHAT_LIMITS.maxHistoryTurns);
  while (recent.length && recent[0].role !== 'user') recent.shift();
  const messages: ChatTurn[] = [];
  for (const t of recent) {
    if (!t.content) continue;
    const limit = t.role === 'assistant' ? MAX_ASSISTANT_CHARS : maxMessageChars;
    const content = t.content.slice(0, limit);
    const prev = messages[messages.length - 1];
    if (prev && prev.role === t.role) prev.content = `${prev.content}\n\n${content}`.slice(-limit);
    else messages.push({ role: t.role, content });
  }
  return { ok: true, messages };
}

/** Rejects cross-site browser requests. Same-origin and non-browser (no Origin header) requests pass. */
export function isAllowedOrigin(headers: Headers): boolean {
  const origin = headers.get('origin');
  if (!origin) return true;
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ── Prompt-injection pre-filter ──────────────────────────────────
// Catches obvious attempts deterministically, without spending an LLM call.
// Anything subtler is handled by the system prompt and the reply checks below.

const OVERRIDE_ATTEMPT =
  /\b(ignore|disregard|forget|override|bypass)\b[^.?!\n]{0,40}\b(instruction|instructions|rules|prompt|guidelines|restrictions|above|previous|prior)\b|\b(developer|dan|jailbreak|god|debug)\s+mode\b|\bact as (an? )?(unrestricted|different|new)\b/i;
const SECRET_TARGET =
  /\b(your|the|its)\s+(system\s+prompt|hidden\s+prompt|initial\s+prompt|instructions|configuration|config|rules)\b|\b(your|the|its)\s+(\w+\s+)?api[\s_-]?keys?\b|\benv(ironment)?\s+var(iable)?s?\b|\.env\b|\bsecret\s+keys?\b/i;
const DISCLOSURE_VERB =
  /\b(reveal|show|print|tell|give|share|repeat|output|display|leak|dump|list|what('?s| is| are)|send|expose)\b/i;

export function isInjectionAttempt(text: string): boolean {
  return OVERRIDE_ATTEMPT.test(text) || (SECRET_TARGET.test(text) && DISCLOSURE_VERB.test(text));
}

// ── Scope gate ───────────────────────────────────────────────────
// A deterministic check before any model call. A question that names neither
// Akshit nor any professional topic, and matches nothing in the knowledge base,
// gets the standard redirect without spending tokens. Borderline and follow-up
// questions go to the model, which applies the same scope rules.

const SUBJECT = /\b(akshit|jain|he|him|his|himself|you|your|candidate|portfolio)\b/i;
const PROFESSIONAL =
  /\b(projects?|skills?|experience|work(ed|ing)?|jobs?|roles?|intern(ship)?|resume|cv|contact|e-?mail|phone|reach|hire|hiring|recruit\w*|interview|github|linkedin|leetcode|education|degree|universit(y|ies)|college|stud(y|ies|ying)|certif\w*|achievements?|awards?|hackathons?|tech(nolog(y|ies))?|stack|languages?|frameworks?|tools?|repo(sitor(y|ies))?|demo|links?|profiles?|background|career|availab\w*|location|based|relocat\w*|salary|notice|team|company)\b/i;

export function isOutOfScope(messages: ChatTurn[], kb: KnowledgeBase = knowledgeBase): boolean {
  const text = messages[messages.length - 1]?.content ?? '';
  if (SUBJECT.test(text) || PROFESSIONAL.test(text)) return false;
  const tokens = tokenize(text);
  if (tokens.some((t) => kb.chunks.some((c) => !c.always && (c.keywords.get(t) ?? 0) >= 2))) return false;
  // In a running conversation, short messages are often follow-ups ("and the second one?").
  const isFollowUp = messages.some((m) => m.role === 'assistant') && text.split(/\s+/).length <= 8;
  return !isFollowUp;
}

// ── Reply validation ─────────────────────────────────────────────

const TRAILING_PUNCT = /[.,;:!?'"]+$/;

export function isAllowedUrl(url: string, kb: KnowledgeBase = knowledgeBase): boolean {
  const u = url.trim();
  if (/^mailto:/i.test(u)) return kb.allowedEmails.has(u.slice(7).split('?')[0].toLowerCase());
  if (u.startsWith('#')) return kb.allowedAnchors.has(u);
  if (/^\/(?!\/)/.test(u) || /^https?:\/\//i.test(u)) return kb.allowedLinks.has(canonicalUrl(u, kb.siteUrl));
  return false;
}

const LINK_OR_URL =
  /\[([^\]\n]{1,300})\]\(\s*([^)\s]+)\s*\)|(https?:\/\/[^\s<>()[\]"'`]+)|(mailto:[^\s<>()[\]"'`]+)/gi;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
// Optional country code, then 1–3 digit groups (e.g. "+91 93505 58221", "9350558221", "(935) 055-8221").
// Only matches with 10+ digits are treated as phone numbers.
const PHONE = /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,5}\)?[\s-]?){0,2}\d{3,10}\b/g;

/**
 * Validates and cleans a model reply before it reaches the visitor.
 * Returns null when the reply must be discarded entirely.
 */
export function sanitizeReply(reply: string, secrets: string[] = [], kb: KnowledgeBase = knowledgeBase): string | null {
  const text = reply.replace(CONTROL_CHARS, '').trim();
  if (!text || leaksSecrets(text, secrets)) return null;
  return cleanText(text, kb).slice(0, 6000);
}

/** True if text contains the prompt canary or a configured credential. */
export function leaksSecrets(text: string, secrets: string[]): boolean {
  return text.includes(PROMPT_CANARY) || secrets.some((s) => s.length >= 8 && text.includes(s));
}

/** Applies the link, email and phone rules to a complete piece of text. */
function cleanText(input: string, kb: KnowledgeBase): string {
  let text = input;

  // Keep only verified links. Unverified ones are reduced to their label.
  text = text.replace(LINK_OR_URL, (match, label?: string, href?: string, bare?: string, mail?: string) => {
    if (label !== undefined && href !== undefined) {
      if (isAllowedUrl(href, kb)) return `[${label}](${href.trim()})`;
      return label.replace(/(https?:\/\/|mailto:)\S+/gi, '(link not available)');
    }
    const raw = (bare ?? mail ?? match) as string;
    const trailing = raw.match(TRAILING_PUNCT)?.[0] ?? '';
    const url = trailing ? raw.slice(0, -trailing.length) : raw;
    return isAllowedUrl(url, kb) ? raw : `(link not available)${trailing}`;
  });

  // Only the verified email address may appear.
  text = text.replace(EMAIL, (m) => (kb.allowedEmails.has(m.toLowerCase()) ? m : '(email not available)'));

  // Phone numbers are never shared through the assistant.
  text = text.replace(PHONE, (m) => (m.replace(/\D/g, '').length >= 10 ? '(phone number not shared)' : m));

  return text;
}

// ── Streaming reply validation ───────────────────────────────────

const OPEN_LINK_TAIL = /\[[^\]\n]*(\](\([^)\s]*)?)?$/;
// A digit run that starts a word (not the "1" at the end of ".../akshitjain1").
const NUMERIC_TAIL = /(?<=^|\s)[+(]?\d[\d\s()+-]*$/;
const MAX_PENDING = 400;

/**
 * Applies the reply rules to a token stream. Text is released only at
 * whitespace boundaries, so URLs, emails and the canary arrive whole and are
 * checked before any part is sent. It holds back an unfinished Markdown link
 * and a trailing run of digits (a possible phone number) until it can judge
 * them. Each push returns the text that is safe to send now.
 */
export class StreamSanitizer {
  private raw = '';
  private pending = '';
  private kb: KnowledgeBase;
  private secrets: string[];
  /** Set once the stream leaked something; the caller must stop and replace the reply. */
  blocked = false;

  constructor(secrets: string[] = [], kb: KnowledgeBase = knowledgeBase) {
    this.secrets = secrets;
    this.kb = kb;
  }

  push(delta: string): string {
    if (this.blocked) return '';
    const clean = delta.replace(CONTROL_CHARS, '');
    this.raw += clean;
    this.pending += clean;
    if (leaksSecrets(this.raw, this.secrets)) {
      this.blocked = true;
      this.pending = '';
      return '';
    }
    let cut = Math.max(this.pending.lastIndexOf(' '), this.pending.lastIndexOf('\n')) + 1;
    if (cut <= 0) {
      if (this.pending.length < MAX_PENDING) return '';
      cut = this.pending.length;
    }
    let ready = this.pending.slice(0, cut);
    const overflow = this.pending.length >= MAX_PENDING;
    const link = ready.match(OPEN_LINK_TAIL);
    if (link && link.index !== undefined && !overflow) ready = ready.slice(0, link.index);
    const digits = ready.match(NUMERIC_TAIL);
    if (digits && digits.index !== undefined && !overflow) ready = ready.slice(0, digits.index);
    this.pending = this.pending.slice(ready.length);
    return ready ? cleanText(ready, this.kb) : '';
  }

  /** Releases whatever is left at the end of the stream. */
  flush(): string {
    if (this.blocked || leaksSecrets(this.raw, this.secrets)) {
      this.blocked = true;
      return '';
    }
    let rest = this.pending;
    this.pending = '';
    // A link cut off at the very end (e.g. the model hit its token limit) keeps only its label.
    const dangling = rest.match(OPEN_LINK_TAIL);
    if (dangling?.index !== undefined) rest = rest.slice(0, dangling.index) + dangling[0].slice(1).split(']')[0];
    return rest ? cleanText(rest, this.kb) : '';
  }

  /** Whether the model has produced any non-whitespace text so far. */
  get hasContent(): boolean {
    return this.raw.trim().length > 0;
  }
}
