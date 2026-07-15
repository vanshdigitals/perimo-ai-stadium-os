"""Contracts for the Resource Deployment domain.

Matches the frontend ``MobileUnit`` fields the Resource Deployment widget uses
(``type`` + ``status``), plus optional position/floor/assignment for the map and
dispatch flows in later phases.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ResourceType(StrEnum):
    security = "security"
    medical = "medical"
    police = "police"
    maintenance = "maintenance"


class ResourceStatus(StrEnum):
    active = "active"
    busy = "busy"
    offline = "offline"


class ResourceUnit(BaseModel):
    id: str
    type: ResourceType
    status: ResourceStatus
    floor: str = "L1"
    assignment: str | None = None


class ResourcesResponse(BaseModel):
    units: list[ResourceUnit]
    deployed: int
    total: int


class AssignResourceRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    assignment: str = Field(min_length=1, max_length=80)
