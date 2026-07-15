"""Facilities routes (mounted under the v1 API prefix, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.facilities.schema import FacilitiesOverview
from src.domains.facilities.service import FacilitiesService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/facilities", tags=["facilities"])


def get_facilities_service(request: Request) -> FacilitiesService:
    return request.app.state.facilities_service


@router.get("/overview", response_model=FacilitiesOverview)
async def overview(
    _user: UserPublic = Depends(require_user),
    service: FacilitiesService = Depends(get_facilities_service),
) -> FacilitiesOverview:
    return service.overview()
