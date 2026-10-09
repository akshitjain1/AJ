// Shared between the chat widget (client) and /api/chat (server).
// Keep this file free of server-only imports.

export type ChatRole = 'user' | 'assistant';

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatTurn[];
}

export type ChatErrorCode =
  | 'BAD_REQUEST'
  | 'TOO_LARGE'
  | 'RATE_LIMITED'
  | 'FORBIDDEN'
  | 'DISABLED'
  | 'BUDGET_EXHAUSTED'
  | 'NOT_CONFIGURED'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INTERRUPTED';

/** Returned as JSON (with a 4xx/5xx status) when a request is refused before streaming starts. */
export interface ChatErrorResponse {
  error: ChatErrorCode;
  message: string;
}

/**
 * A successful reply streams as newline-delimited JSON
 * (Content-Type: application/x-ndjson), one event per line.
 */
export type ChatStreamEvent =
  | { type: 'delta'; text: string }
  /** Discard everything received so far and show this text instead. */
  | { type: 'replace'; text: string }
  | { type: 'done' }
  | { type: 'error'; error: ChatErrorCode; message: string };

export const CHAT_LIMITS = {
  /** Max characters in one visitor message (the server may enforce a lower CHAT_MAX_MESSAGE_CHARS). */
  maxMessageChars: 2000,
  /** Max turns (user + assistant) the client sends as history. */
  maxHistoryTurns: 10,
} as const;
