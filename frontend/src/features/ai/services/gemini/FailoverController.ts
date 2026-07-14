import type { GoogleGenAI } from '@google/genai';
import type { GeminiClientPool } from './GeminiClientPool';
import type { HealthMonitor } from './HealthMonitor';
import type { RetryQueue } from './RetryQueue';
import { computeBackoffDelay, wait } from './RetryQueue';
import type { FailoverEvent, GeminiKeyId } from './types';
import { classifyGeminiError } from './errorClassifier';
import { GeminiConfigError, GeminiAllKeysFailedError } from './errors';
import { log, logError, logWarn } from './logger';

export type GeminiTask<T> = (client: GoogleGenAI) => Promise<T>;

// Primary, Backup, Primary, Backup — matches the requested attempt sequence for a
// 2-key pool. Extends to round-robin across more keys automatically if the pool grows.
const MAX_ATTEMPTS = 4;

/**
 * Runs a Gemini task against the client pool, handling the actual
 * try-primary / failover-to-backup / backoff / retry-primary loop.
 */
export class FailoverController {
  private pool: GeminiClientPool;
  private health: HealthMonitor;
  private retryQueue: RetryQueue;
  private emitEvent: (event: FailoverEvent) => void;

  constructor(
    pool: GeminiClientPool,
    health: HealthMonitor,
    retryQueue: RetryQueue,
    emitEvent: (event: FailoverEvent) => void,
  ) {
    this.pool = pool;
    this.health = health;
    this.retryQueue = retryQueue;
    this.emitEvent = emitEvent;
  }

  async run<T>(task: GeminiTask<T>): Promise<T> {
    const keyIds = this.pool.orderedKeyIds;
    if (keyIds.length === 0) {
      throw new GeminiConfigError('No Gemini API keys are configured.');
    }

    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const keyId = this.pickKeyForAttempt(keyIds, attempt);
      const label = this.pool.labelFor(keyId);

      // Exponential delay before this attempt (0 for attempt 1 — always fire
      // immediately on Primary with no artificial delay).
      const delay = computeBackoffDelay(attempt);
      if (delay > 0) {
        await wait(delay);
      }

      // Skip a key still inside its cooldown window, unless every other key is
      // also cooling down (in which case, best-effort try it anyway).
      const anotherKeyIsReady = keyIds.some((id) => id !== keyId && this.health.isAvailable(id));
      if (!this.health.isAvailable(keyId) && anotherKeyIsReady) {
        logWarn(`Skipping ${label} key — still cooling down (${Math.ceil(this.health.cooldownRemaining(keyId) / 1000)}s remaining).`);
        continue;
      }

      try {
        log(`Attempt ${attempt}/${MAX_ATTEMPTS}: calling Gemini via ${label} key.`);
        const client = this.pool.getClient(keyId);
        const result = await task(client);

        const isRecovery = this.health.recordSuccess(keyId);
        if (isRecovery) {
          log(`${label} key recovered — auto-promoted back into rotation.`);
          this.emitEvent({ type: 'recovered', message: 'Recovered successfully.', timestamp: new Date().toISOString() });
        }
        return result;
      } catch (error) {
        lastError = error;
        const classification = classifyGeminiError(error);
        this.health.recordFailure(keyId);
        logError(`Attempt ${attempt} failed via ${label} key [${classification.category}]`, error);

        const cooldownMs = this.health.cooldownRemaining(keyId);
        if (cooldownMs > 0) {
          this.retryQueue.schedule(keyId, cooldownMs, () => {
            log(`${label} key cooldown elapsed — eligible for retry again.`);
          });
        }

        if (!classification.retryable) {
          logWarn(`${label} key failure is not retryable (${classification.category}) — aborting failover loop early.`);
          break;
        }

        const hasAnotherKey = keyIds.length > 1;
        if (hasAnotherKey && attempt < MAX_ATTEMPTS) {
          this.emitEvent({
            type: attempt === 1 ? 'failover' : 'retrying',
            message: attempt === 1 ? 'Switching to backup...' : 'Retrying...',
            timestamp: new Date().toISOString(),
            attempt,
          });
        }
      }
    }

    this.emitEvent({ type: 'unavailable', message: 'AI Copilot is temporarily unavailable.', timestamp: new Date().toISOString() });
    throw new GeminiAllKeysFailedError(lastError);
  }

  private pickKeyForAttempt(keyIds: GeminiKeyId[], attempt: number): GeminiKeyId {
    return keyIds[(attempt - 1) % keyIds.length];
  }
}
