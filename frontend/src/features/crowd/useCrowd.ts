/**
 * useCrowd — loads the Crowd Intelligence overview from the backend.
 * Single source of truth for admin crowd figures (page + dashboard).
 */

import { useApiQuery } from '@/hooks/data/useApiQuery'
import { fetchCrowdOverview, type CrowdOverview } from './api'

export function useCrowd() {
  return useApiQuery<CrowdOverview>((signal) => fetchCrowdOverview(signal))
}
