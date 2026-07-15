/**
 * useResources — loads the deployment roster from the backend.
 */

import { useApiQuery } from '@/hooks/data/useApiQuery'
import { fetchResources, type ResourcesResponse } from './api'

export function useResources() {
  return useApiQuery<ResourcesResponse>((signal) => fetchResources(signal))
}
