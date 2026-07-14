// Shared types for the Gemini failover subsystem. Keeping these in one file means
// every component (HealthMonitor, FailoverController, GeminiServiceManager, UI hooks)
// agrees on the same shape without circular imports.

/** Identifies a configured API key slot. Not limited to "primary"/"backup" —
 *  additional keys (see GeminiClientPool) get ids like "key_3", "key_4", etc. */
export type GeminiKeyId = string;

export interface GeminiKeyConfig {
  id: GeminiKeyId;
  /** Human-readable label used ONLY in console logs. Never surfaced to the UI. */
  label: string;
  apiKey: string;
  /** Lower priority is tried first. Primary = 0, Backup = 1, extras = 2, 3, ... */
  priority: number;
}

export type ClientHealthState = 'healthy' | 'cooling_down' | 'unhealthy';

export interface ClientHealthSnapshot {
  id: GeminiKeyId;
  state: ClientHealthState;
  consecutiveFailures: number;
  /** Epoch ms until which this key should be skipped; 0 if not cooling down. */
  cooldownUntil: number;
  lastSuccessAt: number | null;
  lastFailureAt: number | null;
}

/** User-safe status events. Every `message` here is pre-approved copy —
 *  nothing derived from raw SDK errors ever flows into this type. */
export type FailoverEventType =
  | 'retrying'
  | 'failover'
  | 'recovered'
  | 'unavailable';

export interface FailoverEvent {
  type: FailoverEventType;
  message: string;
  timestamp: string;
  attempt?: number;
}

export type FailoverListener = (event: FailoverEvent) => void;
