// Server-side limits for the portfolio assistant. Every value comes from
// environment variables (with safe defaults) and none can be set by a
// visitor's request.

type Env = Record<string, string | undefined>;

const int = (v: string | undefined, fallback: number, min = 0) => {
  const n = Number.parseInt((v ?? '').trim(), 10);
  return Number.isFinite(n) && n >= min ? n : fallback;
};

export interface ChatConfig {
  /** Emergency kill switch. CHAT_ENABLED=false disables the assistant on the next deploy. */
  enabled: boolean;
  perMinute: number;
  perHour: number;
  perDay: number;
  maxConcurrent: number;
  maxMessageChars: number;
  /** Maximum model calls across all visitors per UTC day (0 = unlimited). */
  dailyBudget: number;
  /** Max model attempts per question: 1 = no fallback, 2 = one fallback on failure. */
  maxAttempts: number;
  maxOutputTokens: number;
  /** Time allowed to receive the first token from a provider. */
  firstTokenTimeoutMs: number;
  /** Hard cap on one streamed answer, end to end. */
  streamDeadlineMs: number;
}

export function getChatConfig(env: Env = process.env): ChatConfig {
  return {
    enabled: (env.CHAT_ENABLED ?? 'true').trim().toLowerCase() !== 'false',
    perMinute: int(env.CHAT_RATE_PER_MINUTE, 10, 1),
    perHour: int(env.CHAT_RATE_PER_HOUR, 30, 1),
    perDay: int(env.CHAT_RATE_PER_DAY, 60, 1),
    maxConcurrent: int(env.CHAT_MAX_CONCURRENT, 2, 1),
    maxMessageChars: Math.min(int(env.CHAT_MAX_MESSAGE_CHARS, 2000, 1), 4000),
    dailyBudget: int(env.CHAT_DAILY_BUDGET, 500, 0),
    maxAttempts: Math.min(int(env.CHAT_MAX_ATTEMPTS, 2, 1), 3),
    maxOutputTokens: Math.min(int(env.CHAT_MAX_OUTPUT_TOKENS, 700, 64), 2048),
    firstTokenTimeoutMs: Math.min(int(env.CHAT_FIRST_TOKEN_TIMEOUT_MS, 10_000, 100), 20_000),
    streamDeadlineMs: 25_000,
  };
}
