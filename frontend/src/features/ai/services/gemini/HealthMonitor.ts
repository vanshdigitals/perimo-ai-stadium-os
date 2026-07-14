import type { ClientHealthSnapshot, ClientHealthState, GeminiKeyId } from './types';

// Per-key exponential cooldown: 5s, 10s, 20s, 40s ... capped at 5 minutes.
// This is what makes "retry Primary after an appropriate cooldown" and
// "promote a recovered key back to Primary" work automatically — the
// FailoverController always tries keys in priority order and simply skips
// whichever one is still inside its cooldown window.
const BASE_COOLDOWN_MS = 5_000;
const MAX_COOLDOWN_MS = 5 * 60_000;
const UNHEALTHY_THRESHOLD = 3;

interface KeyRecord {
  consecutiveFailures: number;
  cooldownUntil: number;
  lastSuccessAt: number | null;
  lastFailureAt: number | null;
}

function emptyRecord(): KeyRecord {
  return { consecutiveFailures: 0, cooldownUntil: 0, lastSuccessAt: null, lastFailureAt: null };
}

/** Tracks the health of each configured Gemini key independently, in memory. */
export class HealthMonitor {
  private records = new Map<GeminiKeyId, KeyRecord>();

  private getRecord(id: GeminiKeyId): KeyRecord {
    let record = this.records.get(id);
    if (!record) {
      record = emptyRecord();
      this.records.set(id, record);
    }
    return record;
  }

  isAvailable(id: GeminiKeyId, now: number = Date.now()): boolean {
    return this.getRecord(id).cooldownUntil <= now;
  }

  cooldownRemaining(id: GeminiKeyId, now: number = Date.now()): number {
    return Math.max(0, this.getRecord(id).cooldownUntil - now);
  }

  /** Returns true if this key had prior failures — i.e. this success represents
   *  a recovery/promotion event worth telling the user about. */
  recordSuccess(id: GeminiKeyId): boolean {
    const record = this.getRecord(id);
    const isRecovery = record.consecutiveFailures > 0;
    record.consecutiveFailures = 0;
    record.cooldownUntil = 0;
    record.lastSuccessAt = Date.now();
    return isRecovery;
  }

  recordFailure(id: GeminiKeyId): void {
    const record = this.getRecord(id);
    record.consecutiveFailures += 1;
    record.lastFailureAt = Date.now();

    const exponential = BASE_COOLDOWN_MS * Math.pow(2, record.consecutiveFailures - 1);
    const jitter = Math.random() * 0.2 * exponential;
    record.cooldownUntil = Date.now() + Math.min(exponential + jitter, MAX_COOLDOWN_MS);
  }

  private getState(id: GeminiKeyId, now: number): ClientHealthState {
    const record = this.getRecord(id);
    if (record.consecutiveFailures === 0) return 'healthy';
    if (record.consecutiveFailures >= UNHEALTHY_THRESHOLD && record.cooldownUntil > now) return 'unhealthy';
    return 'cooling_down';
  }

  snapshot(id: GeminiKeyId): ClientHealthSnapshot {
    const now = Date.now();
    const record = this.getRecord(id);
    return {
      id,
      state: this.getState(id, now),
      consecutiveFailures: record.consecutiveFailures,
      cooldownUntil: record.cooldownUntil,
      lastSuccessAt: record.lastSuccessAt,
      lastFailureAt: record.lastFailureAt,
    };
  }
}
