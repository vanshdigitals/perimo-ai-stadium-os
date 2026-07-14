import { useEffect, useState } from 'react';
import { geminiServiceManager } from '../services/gemini';
import type { FailoverEvent } from '../services/gemini';

/**
 * Surfaces transient, user-safe status text for the AI Copilot UI — e.g.
 * "Retrying...", "Recovered successfully.", "AI Copilot is temporarily
 * unavailable." — driven entirely by GeminiServiceManager's event stream.
 * The UI never learns which API key is in use, only these pre-approved
 * generic messages.
 */
export const useGeminiStatus = (): string | null => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let clearTimer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = geminiServiceManager.subscribe((event: FailoverEvent) => {
      setStatus(event.message);
      clearTimeout(clearTimer);
      // Terminal states (recovered / exhausted) are transient banners; fade
      // them out after a few seconds instead of leaving stale text on screen.
      if (event.type === 'recovered' || event.type === 'unavailable') {
        clearTimer = setTimeout(() => setStatus(null), 4000);
      }
    });

    return () => {
      clearTimeout(clearTimer);
      unsubscribe();
    };
  }, []);

  return status;
};
