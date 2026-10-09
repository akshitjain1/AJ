// Abuse and cost controls that run before any model call: per-visitor rate
// limits, per-visitor concurrency, a global daily budget, and a kill switch.
//
// Counters live in Upstash Redis when it is configured, so limits hold across
// all Vercel function instances. Without Redis (local dev, or before the
// integration is added) they fall back to this instance's memory. That still
// stops a single burst, but it is not a reliable global limit, because Vercel
// runs many short-lived instances.

import { createHash } from 'node:crypto';
import type { ChatConfig } from './config';

type Env = Record<string, string | undefined>;

export type StoreOp =
  | { op: 'incr'; key: string; ttlSec: number }
  | { op: 'decr'; key: string }
  | { op: 'get'; key: string };

export interface CounterStore {
  /** True when counters are shared by every serverless instance. */
  readonly shared: boolean;
  exec(ops: StoreOp[]): Promise<Array<number | string | null>>;
}

// ── Stores ───────────────────────────────────────────────────────

export class MemoryStore implements CounterStore {
  readonly shared = false;
  private data = new Map<string, { value: number | string; expires: number }>();
  private now: () => number;
  constructor(now: () => number = Date.now) {
    this.now = now;
  }

  private read(key: string) {
    const entry = this.data.get(key);
    if (entry && entry.expires <= this.now()) {
      this.data.delete(key);
      return undefined;
    }
    return entry;
  }

  async exec(ops: StoreOp[]) {
    if (this.data.size > 10_000) this.data.forEach((_, k) => this.read(k)); // sweep expired entries
    return ops.map((o) => {
      const entry = this.read(o.key);
      if (o.op === 'get') return entry ? entry.value : null;
      const next = Number(entry?.value ?? 0) + (o.op === 'incr' ? 1 : -1);
      const expires = o.op === 'incr' ? this.now() + o.ttlSec * 1000 : (entry?.expires ?? this.now() + 60_000);
      this.data.set(o.key, { value: Math.max(next, 0), expires });
      return Math.max(next, 0);
    });
  }

  /** Test/ops helper: set a flag such as the kill switch. */
  set(key: string, value: string, ttlSec = 86_400) {
    this.data.set(key, { value, expires: this.now() + ttlSec * 1000 });
  }

  clear() {
    this.data.clear();
  }
}

/** Upstash Redis over its REST API, one pipelined round trip per call, no SDK. */
export class UpstashStore implements CounterStore {
  readonly shared = true;
  private url: string;
  private token: string;
  private timeoutMs: number;
  constructor(url: string, token: string, timeoutMs = 1500) {
    this.url = url;
    this.token = token;
    this.timeoutMs = timeoutMs;
  }

  async exec(ops: StoreOp[]) {
    const commands: (string | number)[][] = [];
    const resultIndex: number[] = [];
    for (const o of ops) {
      resultIndex.push(commands.length);
      if (o.op === 'incr') commands.push(['INCR', o.key], ['EXPIRE', o.key, o.ttlSec]);
      else if (o.op === 'decr') commands.push(['DECR', o.key]);
      else commands.push(['GET', o.key]);
    }
    const res = await fetch(`${this.url.replace(/\/+$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(this.timeoutMs),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);
    const out = (await res.json()) as Array<{ result?: number | string | null; error?: string }>;
    return resultIndex.map((i) => {
      if (out[i]?.error) throw new Error('upstash command error');
      const r = out[i]?.result ?? null;
      return typeof r === 'string' && /^-?\d+$/.test(r) ? Number(r) : r;
    });
  }
}

/** Uses the shared store, falling back to memory if it is unreachable, so the site never hard-fails. */
class FallbackStore implements CounterStore {
  readonly shared = true;
  private warned = false;
  private primary: CounterStore;
  private fallback: CounterStore;
  constructor(primary: CounterStore, fallback: CounterStore) {
    this.primary = primary;
    this.fallback = fallback;
  }
  async exec(ops: StoreOp[]) {
    try {
      return await this.primary.exec(ops);
    } catch (err) {
      if (!this.warned) {
        console.error(`[chat] rate-limit store unavailable, using per-instance memory: ${(err as Error).message}`);
        this.warned = true;
      }
      return this.fallback.exec(ops);
    }
  }
}

const memory = new MemoryStore();
let cached: { key: string; store: CounterStore } | null = null;

export function getStore(env: Env = process.env): CounterStore {
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || '').trim();
  const token = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || '').trim();
  const key = url && token ? url : 'memory';
  if (cached?.key !== key) {
    cached = { key, store: url && token ? new FallbackStore(new UpstashStore(url, token), memory) : memory };
  }
  return cached.store;
}

// ── Visitor identity ─────────────────────────────────────────────

/**
 * A salted hash of the client IP. On Vercel the platform sets x-real-ip and
 * overwrites x-forwarded-for, so visitors cannot spoof them. Raw IPs are
 * never stored or logged.
 */
export function visitorId(headers: Headers, env: Env = process.env): string {
  const first = (h: string | null) => h?.split(',')[0]?.trim() || null;
  const ip = env.VERCEL
    ? headers.get('x-real-ip') || first(headers.get('x-vercel-forwarded-for')) || first(headers.get('x-forwarded-for'))
    : first(headers.get('x-forwarded-for')) || headers.get('x-real-ip');
  const salt = env.CHAT_ID_SALT || 'portfolio-assistant';
  return createHash('sha256').update(`${salt}|${ip || 'unknown'}`).digest('base64url').slice(0, 22);
}

// ── Admission ────────────────────────────────────────────────────

export const KILL_SWITCH_KEY = 'chat:disabled';

export type Admission =
  | { ok: true; release: () => Promise<void> }
  | { ok: false; reason: 'disabled' | 'minute' | 'hour' | 'day' | 'concurrency'; retryAfterSec: number };

const utcDay = (now: number) => new Date(now).toISOString().slice(0, 10);
const secondsUntilUtcMidnight = (now: number) => Math.ceil((86_400_000 - (now % 86_400_000)) / 1000);

/**
 * Counts the request against every per-visitor window and claims a
 * concurrency slot, all in one store round trip. Requests over a limit are
 * still counted, so hammering the endpoint doesn't reset anything.
 */
export async function admit(id: string, cfg: ChatConfig, store: CounterStore, now = Date.now()): Promise<Admission> {
  const conc = `chat:conc:${id}`;
  const [killed, perMin, perHour, perDay, inFlight] = await store.exec([
    { op: 'get', key: KILL_SWITCH_KEY },
    { op: 'incr', key: `chat:rl:${id}:m:${Math.floor(now / 60_000)}`, ttlSec: 60 },
    { op: 'incr', key: `chat:rl:${id}:h:${Math.floor(now / 3_600_000)}`, ttlSec: 3600 },
    { op: 'incr', key: `chat:rl:${id}:d:${utcDay(now)}`, ttlSec: 86_400 },
    // TTL above the function's 30s limit, so a crashed instance can't hold a slot forever.
    { op: 'incr', key: conc, ttlSec: 60 },
  ]);

  const reject = async (reason: Exclude<Admission, { ok: true }>['reason'], retryAfterSec: number): Promise<Admission> => {
    await store.exec([{ op: 'decr', key: conc }]).catch(() => {});
    return { ok: false, reason, retryAfterSec: Math.max(1, retryAfterSec) };
  };

  if (killed === '1' || killed === 1 || killed === 'true') return reject('disabled', 600);
  if (Number(perMin) > cfg.perMinute) return reject('minute', 60 - Math.floor((now / 1000) % 60));
  if (Number(perHour) > cfg.perHour) return reject('hour', 3600 - Math.floor((now / 1000) % 3600));
  if (Number(perDay) > cfg.perDay) return reject('day', secondsUntilUtcMidnight(now));
  if (Number(inFlight) > cfg.maxConcurrent) return reject('concurrency', 5);

  let released = false;
  return {
    ok: true,
    release: async () => {
      if (released) return;
      released = true;
      await store.exec([{ op: 'decr', key: conc }]).catch(() => {});
    },
  };
}

/** Counts one model call against the global daily budget. Returns false once it is spent. */
export async function consumeBudget(cfg: ChatConfig, store: CounterStore, now = Date.now()): Promise<boolean> {
  if (!cfg.dailyBudget) return true;
  const [used] = await store.exec([{ op: 'incr', key: `chat:budget:${utcDay(now)}`, ttlSec: 90_000 }]);
  return Number(used) <= cfg.dailyBudget;
}
