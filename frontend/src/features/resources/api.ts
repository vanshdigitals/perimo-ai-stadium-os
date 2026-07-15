/**
 * Resource Deployment API types + fetcher.
 * Mirrors `backend/src/domains/resources/schema.py`.
 */

import { apiClient } from '@/platform/api/client'

export type ResourceType = 'security' | 'medical' | 'police' | 'maintenance'
export type ResourceStatus = 'active' | 'busy' | 'offline'

export interface ResourceUnit {
  id: string
  type: ResourceType
  status: ResourceStatus
  floor: string
  assignment?: string | null
}

export interface ResourcesResponse {
  units: ResourceUnit[]
  deployed: number
  total: number
}

export function fetchResources(signal: AbortSignal): Promise<ResourcesResponse> {
  return apiClient.get<ResourcesResponse>('/v1/resources', { signal })
}
