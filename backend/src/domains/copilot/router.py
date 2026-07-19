"""AI Operations Copilot routes (v1, auth-protected).

``POST /recommendations`` is an operations tool restricted to admin/staff; it
returns advisory-only recommendations for the current dashboard snapshot.
``GET /health`` reports the underlying AI service's circuit-breaker health.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.copilot.schema import (
    CopilotHealthResponse,
    CopilotRecommendation,
    DashboardContext,
)
from src.domains.copilot.service import CopilotService
from src.platform.ai.manager import ai_manager
from src.platform.eventbus.bus import DomainEvent
from src.security.auth import UserPublic, UserRole, require_role

router = APIRouter()


def get_copilot_service(request: Request) -> CopilotService:
    return request.app.state.copilot_service


@router.post("/recommendations", response_model=list[CopilotRecommendation])
async def generate_recommendations(
    context: DashboardContext,
    request: Request,
    user: UserPublic = Depends(require_role(UserRole.admin, UserRole.staff)),
    service: CopilotService = Depends(get_copilot_service),
) -> list[CopilotRecommendation]:
    request.app.state.event_bus.publish_sync(
        DomainEvent(event_type="ai.copilot_requested", actor_id=user.id)
    )
    return await service.recommend(context)


@router.get("/health", response_model=CopilotHealthResponse)
def get_ai_health() -> CopilotHealthResponse:
    return CopilotHealthResponse.model_validate(ai_manager.check_health())
