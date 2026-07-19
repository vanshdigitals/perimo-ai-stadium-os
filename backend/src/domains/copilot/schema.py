"""Pydantic contracts for the AI Operations Copilot.

The Copilot ingests a snapshot of the live operations dashboard and returns a
ranked list of grounded, human-in-the-loop recommendations. Every recommendation
is advisory only — the platform never auto-executes an action.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Classification(StrEnum):
    """Operational domain a recommendation belongs to."""

    safety = "SAFETY"
    crowd = "CROWD"
    resource = "RESOURCE"
    transport = "TRANSPORT"
    general = "GENERAL"


class RecommendationStatus(StrEnum):
    pending = "PENDING"
    accepted = "ACCEPTED"
    dismissed = "DISMISSED"


# --- Request context ---


class GateSignal(BaseModel):
    """A single gate's live throughput signal."""

    model_config = ConfigDict(extra="ignore")
    id: str
    name: str = ""
    wait_level: str = Field(default="low", alias="waitLevel")


class ZoneSignal(BaseModel):
    """A crowd-density reading for one stadium zone."""

    model_config = ConfigDict(extra="ignore")
    zone: str
    density: str = "low"


class DashboardContext(BaseModel):
    """Snapshot of the live operations dashboard sent to the Copilot.

    Fields use permissive defaults so a partial dashboard state still yields a
    valid request; unknown extra keys are ignored rather than rejected.
    """

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    timestamp: str
    gate_status: list[GateSignal] = Field(default_factory=list, alias="gateStatus")
    unit_status: dict[str, int] = Field(default_factory=dict, alias="unitStatus")
    crowd_congestion: list[ZoneSignal] = Field(default_factory=list, alias="crowdCongestion")
    thermal_anomalies: int = Field(default=0, ge=0, alias="thermalAnomalies")


# --- Response ---


class CopilotRecommendation(BaseModel):
    """A single advisory recommendation returned to the operations console."""

    id: str
    timestamp: str
    status: RecommendationStatus = RecommendationStatus.pending
    title: str
    explanation: str
    why_it_matters: str = Field(alias="whyItMatters")
    confidence: float = Field(ge=0.0, le=1.0)
    recommended_action: str = Field(alias="recommendedAction")
    estimated_impact: str = Field(alias="estimatedImpact")
    classification: Classification

    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)


class CopilotHealthResponse(BaseModel):
    """Circuit-breaker health of the underlying AI service."""

    status: str
    circuit_state: str
    using_backup: bool
    failure_count: int
