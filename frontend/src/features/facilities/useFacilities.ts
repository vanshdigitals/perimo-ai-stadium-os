/**
 * useFacilities — loads the Facilities overview from the backend.
 *
 * Thin wrapper over `useApiQuery` + `fetchFacilitiesOverview`. The page consumes
 * `{ data, loading, error, refetch }` and renders its existing widgets from
 * `data` when present, keeping the UI visually unchanged.
 */

import { useApiQuery } from '@/hooks/data/useApiQuery'
import { fetchFacilitiesOverview, type FacilitiesOverview } from './api'

export function useFacilities() {
  return useApiQuery<FacilitiesOverview>((signal) => fetchFacilitiesOverview(signal))
}
