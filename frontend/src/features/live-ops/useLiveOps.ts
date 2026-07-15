import { useState, useEffect } from 'react';
import { fetchLiveOpsOverview, type LiveOpsOverview } from './api';

export function useLiveOps() {
  const [data, setData] = useState<LiveOpsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetchLiveOpsOverview(abort.signal);
        setData(res);
        setError(null);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    load();
    return () => abort.abort();
  }, []);

  return { data, isLoading, error };
}
