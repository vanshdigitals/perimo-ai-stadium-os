"""Contracts for the Incident Engine.

Incidents are the core CRUD-able entity (create → transition → assign → escalate).
The composite ``IncidentOverview`` matches the frontend Incident Center page.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Severity(StrEnum):
    Critical = "Critical"
    High = "High"
    Medium = "Medium"
    Low = "Low"


class IncidentStatus(StrEnum):
    Open = "Open"
    Responding = "Responding"
    Monitoring = "Monitoring"
    Resolved = "Resolved"


class Incident(BaseModel):
    id: str
    title: str
    location: str
    severity: Severity
    status: IncidentStatus
    assigned: str
    age: str


class Team(BaseModel):
    name: str
    assigned: str
    status: str


class EscalationLevel(BaseModel):
    level: str
    trigger: str
    authority: str


class TimelineEvent(BaseModel):
    id: str
    time: str
    title: str
    description: str | None = None
    tone: str = "info"


class AIInsight(BaseModel):
    id: str
    title: str
    detail: str
    confidence: int
    classification: str


class IncidentMetaDoc(BaseModel):
    """Static overview data (teams, escalation matrix, timeline, insights)."""

    id: str = "current"
    teams: list[Team]
    escalation_matrix: list[EscalationLevel]
    response_timeline: list[TimelineEvent]
    insights: list[AIInsight]
    avg_response_time: str
    escalations_today: int


class SeverityDistribution(BaseModel):
    critical: int
    high: int
    medium: int
    low: int


class IncidentSummary(BaseModel):
    open_count: int
    critical_count: int
    avg_response_time: str
    teams_deployed: int
    escalations_today: int


class IncidentOverview(BaseModel):
    incidents: list[Incident]
    teams: list[Team]
    escalation_matrix: list[EscalationLevel]
    response_timeline: list[TimelineEvent]
    insights: list[AIInsight]
    severity_distribution: SeverityDistribution
    summary: IncidentSummary


# --- write requests ---


class CreateIncidentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str = Field(min_length=1, max_length=160)
    location: str = Field(min_length=1, max_length=120)
    severity: Severity


class UpdateIncidentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: IncidentStatus


class AssignIncidentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    assigned: str = Field(min_length=1, max_length=80)
