"""Crowd Intelligence routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.crowd.schema import CrowdOverview
from src.domains.crowd.service import CrowdService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/crowd", tags=["crowd"])


def get_crowd_service(request: Request) -> CrowdService:
    return request.app.state.crowd_service


@router.get("/overview", response_model=CrowdOverview)
async def overview(
    _user: UserPublic = Depends(require_user),
    service: CrowdService = Depends(get_crowd_service),
) -> CrowdOverview:
    return service.overview()
