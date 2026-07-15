/**
 * Crowd Intelligence API types + fetcher.
 * Mirrors `backend/src/domains/crowd/schema.py` (CrowdOverview).
 */

import { apiClient } from '@/platform/api/client'

export type ZoneTrend = 'up' | 'down' | 'flat'
export type ZoneStatus = 'Nominal' | 'Elevated' | 'Critical'

export interface ZoneRow {
  id: string
  zone: string
  occupancy: number
  capacity: number
  trend: ZoneTrend
  status: ZoneStatus
}

export type InsightClassification = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface CrowdInsight {
  id: string
  title: string
  detail: string
  confidence: number
  classification: InsightClassification
}

export interface CrowdSummary {
  total_occupancy: number
  projected_peak: string
  highest_density_zone: string
  gates_tracked: number
  congestion_critical: number
  congestion_elevated: number
  avg_flow_rate: number
  avg_flow_delta: string
}

export interface CrowdOverview {
  zones: ZoneRow[]
  occupancy_trend: number[]
  prediction_trend: number[]
  flow_sparkline: number[]
  insights: CrowdInsight[]
  summary: CrowdSummary
}

export function fetchCrowdOverview(signal: AbortSignal): Promise<CrowdOverview> {
  return apiClient.get<CrowdOverview>('/v1/crowd/overview', { signal })
}
