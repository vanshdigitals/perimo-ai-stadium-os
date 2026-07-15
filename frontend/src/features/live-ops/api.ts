/**
 * Live Operations API types + fetcher.
 * Mirrors `backend/src/domains/live_ops/schema.py`
 */

import { apiClient } from '@/platform/api/client'

export interface SystemHealth {
  label: string
  value: string
  tone: 'success' | 'warning' | 'danger'
}

export interface CrowdZoneBar {
  label: string
  value: number
  highlight: boolean
}

export interface EventFeedItem {
  id: string
  time: string
  system?: string // Used in frontend tables, but populated elsewhere if not in schema directly
  event?: string  // Used in frontend tables, mapped from title
  severity?: string // Mapped from tone
  title: string
  description: string
  tone: 'danger' | 'warning' | 'success' | 'info'
}

export interface OperatorLogEntry {
  id: string
  time: string
  title: string
  tone: 'danger' | 'warning' | 'success' | 'info'
}

export type InsightClassification = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface LiveOpsInsight {
  id: string
  title: string
  detail: string
  confidence: number
  classification: InsightClassification
}

export interface LiveOpsSummary {
  gates_open: number
  gates_total: number
  avg_wait_time: number
  crowd_density_pct: number
  active_cameras: number
  total_cameras: number
  match_status: string
  attendance: string
  active_incidents: number
  operators_on_duty: number
  weather: string
}

export interface LiveOpsOverview {
  systems: SystemHealth[]
  crowd_zones: CrowdZoneBar[]
  event_feed: EventFeedItem[]
  operator_log: OperatorLogEntry[]
  insights: LiveOpsInsight[]
  recent_events: EventFeedItem[]
  summary: LiveOpsSummary
}

export function fetchLiveOpsOverview(signal: AbortSignal): Promise<LiveOpsOverview> {
  return apiClient.get<LiveOpsOverview>('/v1/live-ops/overview', { signal })
}
