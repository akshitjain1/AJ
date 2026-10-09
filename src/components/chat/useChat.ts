'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_LIMITS, type ChatErrorResponse, type ChatStreamEvent, type ChatTurn } from '@/lib/chat/types';

export interface UiMessage extends ChatTurn {
  id: string;
  /** The answer is still arriving. */
  streaming?: boolean;
  /** The visitor pressed Stop, or the stream broke part-way. */
  partial?: boolean;
}

export interface ChatError {
  message: string;
  retryable: boolean;
}

const CLIENT_TIMEOUT_MS = 40_000;
let idCounter = 0;
const nextId = () => `m${Date.now().toString(36)}${(idCounter++).toString(36)}`;

/**
 * Conversation state for the portfolio assistant. Answers stream in as the
 * model writes them. History lives only in memory for the current page view.
 */
export function useChat() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);

  const messagesRef = useRef<UiMessage[]>([]);
  const inFlight = useRef<AbortController | null>(null);

  const commit = (next: UiMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  };

  const request = useCallback(async (history: UiMessage[]) => {
    const updateAssistant = (id: string, patch: Partial<UiMessage> | ((m: UiMessage) => Partial<UiMessage>)) =>
      commit(messagesRef.current.map((m) => (m.id === id ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m)));
    if (inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    const timer = setTimeout(() => controller.abort('timeout'), CLIENT_TIMEOUT_MS);
    setLoading(true);
    setError(null);
    let assistantId: string | null = null;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .filter((m) => m.content)
            .slice(-CHAT_LIMITS.maxHistoryTurns)
            .map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body || !(res.headers.get('content-type') ?? '').includes('ndjson')) {
        const data = (await res.json().catch(() => null)) as ChatErrorResponse | null;
        if (controller.signal.aborted) return;
        setError({
          message: data?.message || 'Something went wrong. Please try again.',
          retryable: !['BAD_REQUEST', 'TOO_LARGE', 'FORBIDDEN', 'DISABLED', 'BUDGET_EXHAUSTED'].includes(data?.error ?? ''),
        });
        return;
      }

      const id = nextId();
      assistantId = id;
      commit([...messagesRef.current, { id, role: 'assistant', content: '', streaming: true }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;
      while (!finished) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split('\n');
        buffer = done ? '' : (lines.pop() ?? '');
        for (const raw of lines) {
          if (!raw.trim()) continue;
          let event: ChatStreamEvent;
          try {
            event = JSON.parse(raw);
          } catch {
            continue;
          }
          if (event.type === 'delta') updateAssistant(id, (m) => ({ content: m.content + event.text }));
          else if (event.type === 'replace') updateAssistant(id, { content: event.text });
          else if (event.type === 'done') finished = true;
          else if (event.type === 'error') {
            finished = true;
            updateAssistant(id, { partial: true });
            setError({ message: event.message, retryable: event.error !== 'NOT_CONFIGURED' });
          }
        }
        if (done && !finished) {
          updateAssistant(id, { partial: true });
          setError({ message: 'The answer was cut off. Please try again.', retryable: true });
          finished = true;
        }
      }
      updateAssistant(id, { streaming: false });
    } catch {
      const reason = controller.signal.reason;
      if (assistantId) updateAssistant(assistantId, { streaming: false, partial: reason !== 'reset' });
      if (controller.signal.aborted && reason !== 'timeout') return; // Stop, reset or unmount
      setError({
        message: controller.signal.aborted
          ? 'That took too long to answer. Please try again.'
          : "Couldn't reach the assistant. Check your connection and try again.",
        retryable: true,
      });
    } finally {
      clearTimeout(timer);
      if (inFlight.current === controller) {
        inFlight.current = null;
        setLoading(false);
      }
      // Drop an answer that never produced any text.
      if (assistantId) commit(messagesRef.current.filter((m) => m.id !== assistantId || m.content));
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || inFlight.current || content.length > CHAT_LIMITS.maxMessageChars) return false;
      const next: UiMessage[] = [...messagesRef.current, { id: nextId(), role: 'user', content }];
      commit(next);
      void request(next);
      return true;
    },
    [request],
  );

  /** Re-asks the last question, discarding a partial answer to it. */
  const retry = useCallback(() => {
    const history = [...messagesRef.current];
    if (history[history.length - 1]?.role === 'assistant' && history[history.length - 1].partial) history.pop();
    if (history[history.length - 1]?.role !== 'user') return;
    commit(history);
    void request(history);
  }, [request]);

  /** Stops the answer being generated. The text received so far is kept. */
  const stop = useCallback(() => {
    inFlight.current?.abort('stop');
  }, []);

  const reset = useCallback(() => {
    inFlight.current?.abort('reset');
    inFlight.current = null;
    setLoading(false);
    setError(null);
    commit([]);
  }, []);

  useEffect(() => () => inFlight.current?.abort('unmount'), []);

  const streaming = messages.some((m) => m.streaming);
  return { messages, loading, streaming, error, send, retry, stop, reset };
}
