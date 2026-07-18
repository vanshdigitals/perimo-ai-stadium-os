import { useState, useEffect } from 'react';
import { fanHomeApi, type HomeOverview } from './api';

export const useHome = () => {
  const [data, setData] = useState<HomeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchHome = async () => {
      try {
        setLoading(true);
        const result = await fanHomeApi.getOverview();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHome();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
};
