// Decides whether a Gemini SDK failure is worth failing over/retrying for, or
// whether it's a permanent problem (e.g. a malformed request) that no amount of
// key-swapping will fix.

export type ErrorCategory =
  | 'rate_limit'
  | 'quota'
  | 'server_error'
  | 'network'
  | 'timeout'
  | 'auth'
  | 'invalid_request'
  | 'unknown';

export interface ErrorClassification {
  retryable: boolean;
  category: ErrorCategory;
  statusCode?: number;
}

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

// The @google/genai SDK throws `ApiError` with a numeric `.status`, but network/
// timeout failures surface as plain Error/TypeError/AbortError with no status —
// so we fall back to sniffing the message for well-known signal words.
export function classifyGeminiError(error: unknown): ErrorClassification {
  const err = error as { status?: number; message?: string; name?: string } | undefined;
  const status = err?.status ?? extractStatusFromMessage(err?.message);
  const message = (err?.message ?? String(error ?? '')).toLowerCase();

  if (status === 429 || message.includes('429') || message.includes('rate limit')) {
    return { retryable: true, category: 'rate_limit', statusCode: 429 };
  }
  if (message.includes('quota') || message.includes('resource_exhausted')) {
    return { retryable: true, category: 'quota', statusCode: status };
  }
  if (status === 503 || message.includes('503') || message.includes('unavailable') || message.includes('overloaded')) {
    return { retryable: true, category: 'server_error', statusCode: 503 };
  }
  if (status !== undefined && RETRYABLE_STATUS_CODES.has(status)) {
    return { retryable: true, category: 'server_error', statusCode: status };
  }
  if (message.includes('timeout') || message.includes('deadline') || err?.name === 'AbortError') {
    return { retryable: true, category: 'timeout' };
  }
  if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
    return { retryable: true, category: 'network' };
  }
  if (status === 401 || status === 403 || message.includes('api key') || message.includes('permission') || message.includes('unauthorized')) {
    // Auth failures are key-specific: retrying the SAME key won't help, but the
    // OTHER key may be fine, so this is still "retryable" from the pool's perspective.
    return { retryable: true, category: 'auth', statusCode: status };
  }
  if (status === 400 || message.includes('invalid argument') || message.includes('bad request')) {
    return { retryable: false, category: 'invalid_request', statusCode: 400 };
  }
  // Unknown shape of failure — err on the side of trying the other key rather
  // than giving up immediately.
  return { retryable: true, category: 'unknown', statusCode: status };
}

function extractStatusFromMessage(message: string | undefined): number | undefined {
  if (!message) return undefined;
  const match = /\b(\d{3})\b/.exec(message);
  return match ? Number(match[1]) : undefined;
}
