"""Contracts for the Crowd Intelligence domain.

Shape mirrors the frontend Crowd Intelligence page (zone density table, trends,
KPIs, AI congestion insights) so the page binds with no visual change.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel


class ZoneTrend(StrEnum):
    up = "up"
    down = "down"
    flat = "flat"


class ZoneStatus(StrEnum):
    Nominal = "Nominal"
    Elevated = "Elevated"
    Critical = "Critical"


class ZoneRow(BaseModel):
    id: str
    zone: str
    occupancy: int
    capacity: int
    trend: ZoneTrend
    status: ZoneStatus


class AIInsight(BaseModel):
    id: str
    title: str
    detail: str
    confidence: int
    classification: str


class CrowdMetaDoc(BaseModel):
    """Static/derived overview data stored as one document."""

    id: str = "current"
    occupancy_trend: list[float]
    prediction_trend: list[float]
    flow_sparkline: list[float]
    projected_peak: str
    avg_flow_rate: int
    avg_flow_delta: str
    insights: list[AIInsight]


class CrowdSummary(BaseModel):
    total_occupancy: int
    projected_peak: str
    highest_density_zone: str
    gates_tracked: int
    congestion_critical: int
    congestion_elevated: int
    avg_flow_rate: int
    avg_flow_delta: str


class CrowdOverview(BaseModel):
    zones: list[ZoneRow]
    occupancy_trend: list[float]
    prediction_trend: list[float]
    flow_sparkline: list[float]
    insights: list[AIInsight]
    summary: CrowdSummary
