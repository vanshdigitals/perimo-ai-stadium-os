"""Transportation routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.transportation.schema import TransportOverview
from src.domains.transportation.service import TransportService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/transport", tags=["transportation"])


def get_transport_service(request: Request) -> TransportService:
    return request.app.state.transport_service


@router.get("/overview", response_model=TransportOverview)
async def overview(
    _user: UserPublic = Depends(require_user),
    service: TransportService = Depends(get_transport_service),
) -> TransportOverview:
    return service.overview()
