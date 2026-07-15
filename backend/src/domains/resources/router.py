"""Resource Deployment routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.resources.schema import (
    AssignResourceRequest,
    ResourcesResponse,
    ResourceUnit,
)
from src.domains.resources.service import ResourceService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/resources", tags=["resources"])


def get_resource_service(request: Request) -> ResourceService:
    return request.app.state.resource_service


@router.get("", response_model=ResourcesResponse)
async def list_resources(
    _user: UserPublic = Depends(require_user),
    service: ResourceService = Depends(get_resource_service),
) -> ResourcesResponse:
    return service.list()


@router.post("/{unit_id}/assign", response_model=ResourceUnit)
async def assign_resource(
    unit_id: str,
    body: AssignResourceRequest,
    _user: UserPublic = Depends(require_user),
    service: ResourceService = Depends(get_resource_service),
) -> ResourceUnit:
    return service.assign(unit_id, body.assignment)
