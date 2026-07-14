import { GeminiClientPool } from './GeminiClientPool';
import { HealthMonitor } from './HealthMonitor';
import { RetryQueue } from './RetryQueue';
import { FailoverController } from './FailoverController';
import type { GeminiTask } from './FailoverController';
import type { FailoverEvent, FailoverListener } from './types';
import { log, logError } from './logger';

/**
 * GeminiServiceManager
 * ---------------------
 * Single entry point for every Gemini API call in the app. Wraps the raw
 * @google/genai SDK with automatic Primary/Backup key failover so callers —
 * and the UI — never need to know (or care) which key actually served a
 * given request.
 *
 *   GeminiServiceManager
 *   ├── GeminiClientPool   → owns the PrimaryClient/BackupClient SDK instances
 *   │                        (and any extra keys added later)
 *   ├── HealthMonitor      → tracks per-key failure counts & cooldowns
 *   ├── RetryQueue         → backoff delay math + deferred cooldown callbacks
 *   └── FailoverController → runs the try/failover/backoff/retry loop
 *
 * Usage:
 *   const text = await geminiServiceManager.execute(
 *     (client) => client.models.generateContent({ ... })
 *   );
 *
 * The manager guarantees:
 *   - Primary is always tried first when healthy (req. 1, 9).
 *   - Retryable failures (429/503/quota/timeout/network/etc.) trigger an
 *     automatic switch to Backup, no user interaction required (req. 2).
 *   - If Backup also fails, Primary is retried after its cooldown elapses,
 *     with exponential backoff between attempts (req. 3, 8).
 *   - Raw SDK errors never escape this module — only the generic
 *     FailoverEvent messages and the errors in `./errors` do (req. 4, 5).
 *   - Every attempt/failover/recovery is logged with a timestamp (req. 6).
 */
class GeminiServiceManager {
  private pool: GeminiClientPool;
  private health: HealthMonitor;
  private retryQueue: RetryQueue;
  private controller: FailoverController;
  private listeners: Set<FailoverListener>;

  constructor() {
    this.pool = new GeminiClientPool();
    this.health = new HealthMonitor();
    this.retryQueue = new RetryQueue();
    this.listeners = new Set();
    this.controller = new FailoverController(this.pool, this.health, this.retryQueue, (event) =>
      this.emit(event),
    );
  }

  /** Runs `task` against the healthiest available Gemini client, failing over
   *  and retrying with backoff as needed. Resolves/rejects exactly like a
   *  single call would — every bit of failover complexity stays inside here. */
  async execute<T>(task: GeminiTask<T>): Promise<T> {
    return this.controller.run(task);
  }

  /** Subscribe to user-facing status events (for toasts/banners in the UI).
   *  Returns an unsubscribe function. Messages are always generic/pre-approved
   *  copy — never raw API errors or key identifiers. */
  subscribe(listener: FailoverListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: FailoverEvent): void {
    log(`Status event: ${event.type} — "${event.message}"`);
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        logError('A status listener threw while handling a failover event.', error);
      }
    });
  }
}

// Single shared instance — every feature that talks to Gemini should go through
// this, so key health/cooldown state is consistent app-wide.
export const geminiServiceManager = new GeminiServiceManager();
