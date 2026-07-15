/**
 * Incident Center API types + fetcher.
 * Mirrors `backend/src/domains/incidents/schema.py` (IncidentOverview).
 */

import { apiClient } from '@/platform/api/client'

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type IncidentStatus = 'Open' | 'Responding' | 'Monitoring' | 'Resolved'

export interface Incident {
  id: string
  title: string
  location: string
  severity: Severity
  status: IncidentStatus
  assigned: string
  age: string
}

export interface IncidentTeam {
  name: string
  assigned: string
  status: string
}

export interface EscalationLevel {
  level: string
  trigger: string
  authority: string
}

export interface IncidentTimelineEvent {
  id: string
  time: string
  title: string
  description?: string | null
  tone: string
}

export type InsightClassification = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface IncidentInsight {
  id: string
  title: string
  detail: string
  confidence: number
  classification: InsightClassification
}

export interface SeverityDistribution {
  critical: number
  high: number
  medium: number
  low: number
}

export interface IncidentSummary {
  open_count: number
  critical_count: number
  avg_response_time: string
  teams_deployed: number
  escalations_today: number
}

export interface IncidentOverview {
  incidents: Incident[]
  teams: IncidentTeam[]
  escalation_matrix: EscalationLevel[]
  response_timeline: IncidentTimelineEvent[]
  insights: IncidentInsight[]
  severity_distribution: SeverityDistribution
  summary: IncidentSummary
}

export function fetchIncidentOverview(signal: AbortSignal): Promise<IncidentOverview> {
  return apiClient.get<IncidentOverview>('/v1/incidents/overview', { signal })
}
