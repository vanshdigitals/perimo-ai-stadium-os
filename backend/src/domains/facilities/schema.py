"""Contracts for the Facilities domain.

The shape mirrors exactly what the existing frontend Facilities page renders
(power/HVAC/water/maintenance/cleaning) so the page can bind to it with no visual
change — the frontend is the source of truth for the contract.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel


class MaintenancePriority(StrEnum):
    High = "High"
    Medium = "Medium"
    Low = "Low"


class MaintenanceStatus(StrEnum):
    Queued = "Queued"
    Dispatched = "Dispatched"
    Resolved = "Resolved"


class WaterStatus(StrEnum):
    Nominal = "Nominal"
    Degraded = "Degraded"
    Offline = "Offline"


class MaintenanceRequest(BaseModel):
    id: str
    location: str
    issue: str
    priority: MaintenancePriority
    status: MaintenanceStatus


class HvacZone(BaseModel):
    zone: str
    temp_f: int


class WaterSystem(BaseModel):
    system: str
    status: WaterStatus


class CleaningEvent(BaseModel):
    id: str
    time: str
    title: str
    description: str | None = None
    tone: str = "info"


class PowerStatus(BaseModel):
    load_mw: float
    baseline_delta: str
    trend: list[float]
    labels: list[str]


class FacilitiesSummary(BaseModel):
    avg_core_temp_f: int
    sanitation: str
    open_maintenance: int


class FacilitiesOverview(BaseModel):
    """Everything the Facilities page needs, in one response."""

    power: PowerStatus
    hvac_zones: list[HvacZone]
    water_systems: list[WaterSystem]
    maintenance: list[MaintenanceRequest]
    cleaning_schedule: list[CleaningEvent]
    summary: FacilitiesSummary


# --- internal stored shape for the systems document ---


class FacilitySystemsDoc(BaseModel):
    id: str = "current"
    power: PowerStatus
    hvac_zones: list[HvacZone]
    water_systems: list[WaterSystem]
    cleaning_schedule: list[CleaningEvent]
    summary_sanitation: str
    summary_avg_temp_f: int
