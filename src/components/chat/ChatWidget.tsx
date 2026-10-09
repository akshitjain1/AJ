'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowUp, ArrowUpRight, RotateCcw, Sparkles, Square, X } from 'lucide-react';
import Markdown from './Markdown';
import { useChat } from './useChat';
import { CHAT_LIMITS } from '@/lib/chat/types';

const SUGGESTIONS = [
  'Tell me about Akshit.',
  'Explore his AI and ML projects.',
  'What are his strongest technical skills?',
  'Tell me about his professional experience.',
  'View his GitHub and LinkedIn.',
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, send, retry, stop, reset } = useChat();
  const reduceMotion = useReducedMotion();

  const titleId = useId();
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const restoreFocus = useRef(false);

  const close = () => {
    restoreFocus.current = true;
    setOpen(false);
  };

  // Focus the composer on open; return focus to the launcher on close.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    if (restoreFocus.current) {
      restoreFocus.current = false;
      requestAnimationFrame(() => launcherRef.current?.focus());
    }
  }, [open]);

  // Follow new messages only if the visitor hasn't scrolled up to read.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const lastIsUser = messages[messages.length - 1]?.role === 'user';
    if (stickToBottom.current || lastIsUser) {
      el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [messages, loading, error, reduceMotion]);

  // Auto-grow the composer up to ~5 lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open]);

  const submit = (text = input) => {
    if (send(text)) {
      setInput('');
      stickToBottom.current = true;
    }
  };

  const onComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const newChat = () => {
    reset();
    setInput('');
    inputRef.current?.focus();
  };

  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.32, ease: EASE },
      };

  const remaining = CHAT_LIMITS.maxMessageChars - input.length;
  const empty = messages.length === 0;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask about Akshit: open the AI portfolio assistant"
            aria-expanded={false}
            aria-controls={panelId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: EASE }}
            className="group fixed bottom-5 right-5 z-[90] inline-flex h-14 w-14 items-center justify-center gap-2.5 rounded-full bg-zinc-900 text-white shadow-xl shadow-zinc-900/25 hover:bg-zinc-800 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:bottom-6 sm:right-6 sm:w-auto sm:pl-4 sm:pr-5"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Sparkles size={18} className="text-indigo-300 transition-transform duration-300 motion-safe:group-hover:rotate-12" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">Ask about Akshit</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                close();
              }
            }}
            {...panelMotion}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-x-0 bottom-0 z-[90] flex h-[min(88dvh,720px)] flex-col overflow-hidden rounded-t-[1.75rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/20 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(660px,calc(100dvh-3rem))] sm:w-[410px] sm:rounded-[1.75rem]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-indigo-300">
                <Sparkles size={17} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-xl font-extrabold uppercase leading-none tracking-tight text-zinc-900">
                  Ask About Akshit
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  AI portfolio assistant
                </p>
              </div>
              <button
                type="button"
                onClick={newChat}
                disabled={empty && !error}
                aria-label="Start a new chat"
                title="New chat"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-30"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                title="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X size={18} />
              </button>
            </header>

            {/* Conversation */}
            <div
              ref={logRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
              }}
              className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
            >
              {empty && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl rounded-bl-md border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-700">
                    <p className="font-semibold text-zinc-900">Hi, I&apos;m Akshit&apos;s AI portfolio assistant.</p>
                    <p className="mt-1">
                      Ask about his projects, skills, experience at Centific, achievements, or how to reach him. Answers come from his
                      portfolio and resume.
                    </p>
                  </div>
                  <div>
                    <p className="section-label mb-2.5 !text-[0.65rem]">Try asking</p>
                    <ul className="flex flex-col gap-2">
                      {SUGGESTIONS.map((q) => (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => submit(q)}
                            disabled={loading}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-sm text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
                          >
                            {q}
                            <ArrowUpRight size={15} className="shrink-0 text-zinc-400 group-hover:text-indigo-300" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div role="log" aria-live="polite" aria-relevant="additions" aria-busy={loading} aria-label="Conversation" className="flex flex-col gap-3">
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <div
                      key={m.id}
                      className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-sm leading-relaxed text-white"
                    >
                      <span className="sr-only">You: </span>
                      {m.content}
                    </div>
                  ) : (
                    <div
                      key={m.id}
                      className="max-w-[94%] self-start break-words rounded-2xl rounded-bl-md border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-700"
                    >
                      <span className="sr-only">Assistant: </span>
                      <Markdown content={m.content} />
                      {m.streaming && (
                        <span
                          aria-hidden="true"
                          className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 rounded-sm bg-indigo-400 motion-safe:animate-pulse"
                        />
                      )}
                      {m.partial && !m.streaming && (
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Answer stopped</p>
                      )}
                    </div>
                  ),
                )}
              </div>

              {loading && !messages.some((m) => m.streaming && m.content) && (
                <div
                  role="status"
                  className="flex items-center gap-2.5 self-start rounded-2xl rounded-bl-md border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500"
                >
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400 motion-safe:animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                  Generating answer…
                </div>
              )}

              {error && !loading && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    <p>{error.message}</p>
                    {error.retryable && (
                      <button
                        type="button"
                        onClick={retry}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <RotateCcw size={12} aria-hidden="true" /> Retry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="border-t border-zinc-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-1.5 pl-4 transition-colors focus-within:border-zinc-900 focus-within:bg-white">
                <label htmlFor={`${panelId}-input`} className="sr-only">
                  Ask a question about Akshit
                </label>
                <textarea
                  id={`${panelId}-input`}
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={CHAT_LIMITS.maxMessageChars}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onComposerKeyDown}
                  placeholder="Ask about his skills, projects, experience…"
                  className="max-h-[132px] flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                {loading ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Stop generating"
                    title="Stop"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <Square size={13} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send question"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:bg-zinc-300 disabled:hover:bg-zinc-300"
                  >
                    <ArrowUp size={17} />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[11px] text-zinc-400">
                <span>AI-generated from Akshit&apos;s portfolio and resume.</span>
                {remaining < 200 && (
                  <span className={remaining <= 0 ? 'text-red-600' : undefined} aria-live="polite">
                    {remaining} left
                  </span>
                )}
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
