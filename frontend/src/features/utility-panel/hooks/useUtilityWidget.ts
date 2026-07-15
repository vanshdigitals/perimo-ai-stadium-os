import { useState, useEffect } from 'react';

export type WidgetState = 'loading' | 'empty' | 'error' | 'realtime' | 'offline';

interface UseUtilityWidgetResult<T> {
  data: T | null;
  state: WidgetState;
  error: Error | null;
  retry: () => void;
  updateData: (newData: T) => void;
}

export function useUtilityWidget<T>(
  fetcher: () => Promise<T>,
  isEmpty: (data: T) => boolean,
  dependencies: any[] = []
): UseUtilityWidgetResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<WidgetState>('loading');
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setState('loading');
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      if (isEmpty(result)) {
        setState('empty');
      } else {
        setState('realtime');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setState('error');
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Expose manual update for optimistic UI / WebSockets
  const updateData = (newData: T) => {
    setData(newData);
    if (isEmpty(newData)) {
      setState('empty');
    } else {
      setState('realtime');
    }
  };

  return { data, state, error, retry: loadData, updateData };
}
