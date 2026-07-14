// Backoff timing for the failover loop. Attempt 1 (Primary) fires immediately;
// every attempt after that waits longer than the last, so a flapping key or a
// genuinely overloaded API isn't hammered with instant back-to-back retries.
//   Attempt 1 -> 0ms, Attempt 2 -> ~400ms, Attempt 3 -> ~800ms, Attempt 4 -> ~1600ms, ...
const BASE_DELAY_MS = 400;
const MAX_DELAY_MS = 8_000;

export function computeBackoffDelay(attempt: number): number {
  if (attempt <= 1) return 0;
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt - 2);
  const jitter = Math.random() * 0.3 * exponential;
  return Math.min(exponential + jitter, MAX_DELAY_MS);
}

export function wait(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * RetryQueue: owns the scheduling primitives for deferred retries. Today this is
 * just the backoff delay helpers above, used synchronously inside a single
 * `execute()` call. It's kept as its own class (rather than free functions) so a
 * future "proactive background health probe" (re-check a cooling-down key without
 * waiting for the next real user request) has an obvious home — call
 * `schedule(keyId, delay, probeFn)` from GeminiServiceManager once that's needed.
 */
export class RetryQueue {
  private timers: Map<string, ReturnType<typeof setTimeout>>;

  constructor() {
    this.timers = new Map();
  }

  schedule(keyId: string, delayMs: number, callback: () => void): void {
    this.cancel(keyId);
    const timer = setTimeout(() => {
      this.timers.delete(keyId);
      callback();
    }, delayMs);
    this.timers.set(keyId, timer);
  }

  cancel(keyId: string): void {
    const existing = this.timers.get(keyId);
    if (existing) {
      clearTimeout(existing);
      this.timers.delete(keyId);
    }
  }

  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}
