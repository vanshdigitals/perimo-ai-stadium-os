/**
 * useIncidents — loads the Incident Center overview from the backend.
 */

import { useApiQuery } from '@/hooks/data/useApiQuery'
import { fetchIncidentOverview, type IncidentOverview } from './api'

export function useIncidents() {
  return useApiQuery<IncidentOverview>((signal) => fetchIncidentOverview(signal))
}
