// Typed errors for the failover subsystem. Callers can branch on `instanceof` to
// pick a user-safe message without ever inspecting the raw underlying SDK error.

export class GeminiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiConfigError';
  }
}

/** Thrown once every configured key has been tried (across all attempts/backoff
 *  rounds) and none succeeded. `lastError` is kept for console logging only. */
export class GeminiAllKeysFailedError extends Error {
  lastError: unknown;

  constructor(lastError: unknown) {
    super('All configured Gemini API keys failed.');
    this.name = 'GeminiAllKeysFailedError';
    this.lastError = lastError;
  }
}
