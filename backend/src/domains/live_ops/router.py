"""Live Operations routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.live_ops.schema import LiveOpsOverview
from src.domains.live_ops.service import LiveOpsService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/live-ops", tags=["live-ops"])


def get_live_ops_service(request: Request) -> LiveOpsService:
    return request.app.state.live_ops_service


@router.get("/overview", response_model=LiveOpsOverview)
async def overview(
    _user: UserPublic = Depends(require_user),
    service: LiveOpsService = Depends(get_live_ops_service),
) -> LiveOpsOverview:
    return service.overview()
