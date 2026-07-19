"""Incident Engine routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.incidents.schema import (
    AssignIncidentRequest,
    CreateIncidentRequest,
    Incident,
    IncidentOverview,
    UpdateIncidentRequest,
)
from src.domains.incidents.service import IncidentService
from src.security.auth.dependencies import require_role, require_user
from src.security.auth.schemas import UserPublic, UserRole

router = APIRouter(prefix="/incidents", tags=["incidents"])

# Incident write-ops (assign/escalate) are restricted to operational roles.
require_operator = require_role(UserRole.admin, UserRole.staff)


def get_incident_service(request: Request) -> IncidentService:
    return request.app.state.incident_service


@router.get("", response_model=list[Incident])
async def list_incidents(
    _user: UserPublic = Depends(require_user),
    service: IncidentService = Depends(get_incident_service),
) -> list[Incident]:
    return service.list()


@router.get("/overview", response_model=IncidentOverview)
async def overview(
    _user: UserPublic = Depends(require_user),
    service: IncidentService = Depends(get_incident_service),
) -> IncidentOverview:
    return service.overview()


@router.post("", response_model=Incident, status_code=201)
async def create_incident(
    body: CreateIncidentRequest,
    _user: UserPublic = Depends(require_user),
    service: IncidentService = Depends(get_incident_service),
) -> Incident:
    return service.create(title=body.title, location=body.location, severity=body.severity)


@router.patch("/{incident_id}", response_model=Incident)
async def update_incident(
    incident_id: str,
    body: UpdateIncidentRequest,
    _user: UserPublic = Depends(require_user),
    service: IncidentService = Depends(get_incident_service),
) -> Incident:
    return service.transition(incident_id, body.status)


@router.post("/{incident_id}/assign", response_model=Incident)
async def assign_incident(
    incident_id: str,
    body: AssignIncidentRequest,
    _user: UserPublic = Depends(require_operator),
    service: IncidentService = Depends(get_incident_service),
) -> Incident:
    return service.assign(incident_id, body.assigned)


@router.post("/{incident_id}/escalate", response_model=Incident)
async def escalate_incident(
    incident_id: str,
    _user: UserPublic = Depends(require_operator),
    service: IncidentService = Depends(get_incident_service),
) -> Incident:
    return service.escalate(incident_id)
