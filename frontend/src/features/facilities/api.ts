/**
 * Facilities API types + fetchers.
 *
 * The types mirror the backend `FacilitiesOverview` contract exactly (see
 * `backend/src/domains/facilities/schema.py`). The page binds to these so its
 * rendered output is identical to the previous mock-driven version.
 */

import { apiClient } from '@/platform/api/client'

export type MaintenancePriority = 'High' | 'Medium' | 'Low'
export type MaintenanceStatus = 'Queued' | 'Dispatched' | 'Resolved'
export type WaterStatusValue = 'Nominal' | 'Degraded' | 'Offline'

export interface MaintenanceRequest {
  id: string
  location: string
  issue: string
  priority: MaintenancePriority
  status: MaintenanceStatus
}

export interface HvacZone {
  zone: string
  temp_f: number
}

export interface WaterSystem {
  system: string
  status: WaterStatusValue
}

export interface CleaningEvent {
  id: string
  time: string
  title: string
  description?: string | null
  tone: string
}

export interface PowerStatus {
  load_mw: number
  baseline_delta: string
  trend: number[]
  labels: string[]
}

export interface FacilitiesSummary {
  avg_core_temp_f: number
  sanitation: string
  open_maintenance: number
}

export interface FacilitiesOverview {
  power: PowerStatus
  hvac_zones: HvacZone[]
  water_systems: WaterSystem[]
  maintenance: MaintenanceRequest[]
  cleaning_schedule: CleaningEvent[]
  summary: FacilitiesSummary
}

export function fetchFacilitiesOverview(signal: AbortSignal): Promise<FacilitiesOverview> {
  return apiClient.get<FacilitiesOverview>('/v1/facilities/overview', { signal })
}
