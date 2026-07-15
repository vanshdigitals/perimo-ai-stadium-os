import { useEffect, useState } from 'react';
import { apiClient } from '../../../platform/api/client';

/**
 * Surfaces transient, user-safe status text for the AI Copilot UI.
 * Driven by the backend AI Copilot health endpoint.
 */
export const useGeminiStatus = (): string | null => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const checkHealth = async () => {
      try {
        const res = await apiClient.get<{ status: string }>('/v1/copilot/health');
        if (!mounted) return;
        
        if (res.status === 'failing') {
          setStatus('AI Copilot is temporarily unavailable.');
        } else if (res.status === 'degraded') {
          setStatus('Retrying AI Copilot connection...');
        } else {
          // If status is healthy but we previously had an error, we can briefly show a message
          if (status === 'Retrying AI Copilot connection...') {
            setStatus('Recovered successfully.');
            setTimeout(() => { if (mounted) setStatus(null); }, 4000);
          } else if (status !== 'Recovered successfully.') {
            setStatus(null);
          }
        }
      } catch (error) {
        if (mounted) {
           setStatus('AI Copilot is temporarily unavailable.');
        }
      }

      if (mounted) {
        timer = setTimeout(checkHealth, 10000); // Check every 10s
      }
    };

    checkHealth();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [status]);

  return status;
};
