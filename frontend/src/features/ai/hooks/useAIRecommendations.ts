import { useState, useEffect, useRef } from 'react';
import type { AIRecommendation, RecommendationStatus, DashboardContext } from '../types';
import { GeminiRecommendationService } from '../services/GeminiRecommendationService';

export const useAIRecommendations = (context: DashboardContext) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastFetchTimeRef = useRef<number>(0);
  const previousCriticalHashRef = useRef<string>('');

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newRecs = await GeminiRecommendationService.generateRecommendations(context);
      setRecommendations(prev => {
        // Prevent duplicate titles
        const existingTitles = new Set(prev.map(r => r.title));
        const uniqueNewRecs = newRecs.filter(r => !existingTitles.has(r.title));
        // Keep up to 15 recommendations in the feed
        return [...uniqueNewRecs, ...prev].slice(0, 15);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch AI insights.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Intelligently determine if we should hit the API.
    // Calculate a 'critical hash' from the context.
    const criticalGates = context.gates.filter(g => g.waitLevel === 'high' || g.waitLevel === 'medium').length;
    const criticalCrowds = context.crowdFlows.filter(c => c.density === 'high' || c.density === 'medium').length;
    const busyUnits = context.units.filter(u => u.status === 'busy').length;
    
    const currentHash = `${criticalGates}-${criticalCrowds}-${busyUnits}`;
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    // Conditions to fetch:
    // 1. Initial load (lastFetchTime === 0)
    // 2. 60 seconds have passed since last fetch
    // 3. Meaningful change in critical items AND at least 10 seconds have passed (debounce)
    const isInitialLoad = lastFetchTimeRef.current === 0;
    const isStale = timeSinceLastFetch > 60000;
    const isMeaningfulChange = currentHash !== previousCriticalHashRef.current && timeSinceLastFetch > 10000;

    if (!isLoading && (isInitialLoad || isStale || isMeaningfulChange)) {
      previousCriticalHashRef.current = currentHash;
      lastFetchTimeRef.current = now;
      fetchRecommendations();
    }
  }, [context]); // Re-evaluates every time context updates

  const updateStatus = (id: string, status: RecommendationStatus) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const forceRefresh = () => {
    if (isLoading) return;
    lastFetchTimeRef.current = Date.now();
    fetchRecommendations();
  };

  return { recommendations, isLoading, error, updateStatus, forceRefresh };
};
