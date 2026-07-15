/**
 * Transportation API types + fetcher.
 * Mirrors `backend/src/domains/transportation/schema.py`
 */

import { apiClient } from '@/platform/api/client'

export interface ParkingLot {
  lot: string
  pct: number
}

export interface Shuttle {
  id: string
  route: string
  eta: string
  occupancy: string
}

export interface RoadCondition {
  segment: string
  status: 'Heavy' | 'Moderate' | 'Clear'
  delay: string
}

export interface TransitEvent {
  id: string
  time: string
  title: string
  description: string
  tone: 'success' | 'warning' | 'info' | 'danger'
}

export type InsightClassification = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface TransportInsight {
  id: string
  title: string
  detail: string
  confidence: number
  classification: InsightClassification
}

export interface TransportSummary {
  general_parking_pct: number
  shuttle_arrivals_15m: number
  rail_status: string
  vip_escorts_en_route: number
}

export interface TransportOverview {
  parking: ParkingLot[]
  shuttles: Shuttle[]
  roads: RoadCondition[]
  transit_events: TransitEvent[]
  insights: TransportInsight[]
  summary: TransportSummary
}

export function fetchTransportOverview(signal: AbortSignal): Promise<TransportOverview> {
  return apiClient.get<TransportOverview>('/v1/transport/overview', { signal })
}
