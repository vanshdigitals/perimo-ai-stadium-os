// Centralized, timestamped console logging for the failover subsystem.
// Requirement: every failover event must be logged with a timestamp — and raw
// error detail must stay in the console, never bubble up into UI-facing strings.

const PREFIX = '[GeminiServiceManager]';

export function log(message: string, ...rest: unknown[]): void {
  console.log(`${PREFIX} ${new Date().toISOString()} ${message}`, ...rest);
}

export function logWarn(message: string, ...rest: unknown[]): void {
  console.warn(`${PREFIX} ${new Date().toISOString()} ${message}`, ...rest);
}

export function logError(message: string, error: unknown): void {
  console.error(`${PREFIX} ${new Date().toISOString()} ${message}`, error);
}
