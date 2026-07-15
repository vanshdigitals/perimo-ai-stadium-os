"""Contracts for the Live Operations domain.

Mirrors the frontend LiveOperations page shape exactly.
"""

from __future__ import annotations

from pydantic import BaseModel


class SystemHealth(BaseModel):
    label: str
    value: str
    tone: str  # success | warning | danger


class CrowdZoneBar(BaseModel):
    label: str
    value: int
    highlight: bool = False


class EventFeedItem(BaseModel):
    id: str
    time: str
    title: str
    description: str
    tone: str  # danger | warning | success | info


class OperatorLogEntry(BaseModel):
    id: str
    time: str
    title: str
    tone: str


class LiveOpsInsight(BaseModel):
    id: str
    title: str
    detail: str
    confidence: int
    classification: str  # CRITICAL | HIGH | MEDIUM | INFO


class LiveOpsSummary(BaseModel):
    gates_open: int
    gates_total: int
    avg_wait_time: float
    crowd_density_pct: int
    active_cameras: int
    total_cameras: int
    match_status: str
    attendance: str
    active_incidents: int
    operators_on_duty: int
    weather: str


class LiveOpsOverview(BaseModel):
    systems: list[SystemHealth]
    crowd_zones: list[CrowdZoneBar]
    event_feed: list[EventFeedItem]
    operator_log: list[OperatorLogEntry]
    insights: list[LiveOpsInsight]
    recent_events: list[EventFeedItem]
    summary: LiveOpsSummary
