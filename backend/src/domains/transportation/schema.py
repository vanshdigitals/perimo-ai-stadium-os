"""Contracts for the Transportation domain.

Shape mirrors the frontend Transportation page so the page binds with no visual
change when switched from hardcoded constants to API-fetched data.
"""

from __future__ import annotations

from pydantic import BaseModel


class ParkingLot(BaseModel):
    lot: str
    pct: int


class Shuttle(BaseModel):
    id: str
    route: str
    eta: str
    occupancy: str


class RoadCondition(BaseModel):
    segment: str
    status: str  # Heavy | Moderate | Clear
    delay: str


class TransitEvent(BaseModel):
    id: str
    time: str
    title: str
    description: str
    tone: str  # success | warning | info | danger


class TransportInsight(BaseModel):
    id: str
    title: str
    detail: str
    confidence: int
    classification: str  # HIGH | MEDIUM | INFO | CRITICAL


class TransportSummary(BaseModel):
    general_parking_pct: int
    shuttle_arrivals_15m: int
    rail_status: str
    vip_escorts_en_route: int


class TransportOverview(BaseModel):
    parking: list[ParkingLot]
    shuttles: list[Shuttle]
    roads: list[RoadCondition]
    transit_events: list[TransitEvent]
    insights: list[TransportInsight]
    summary: TransportSummary
