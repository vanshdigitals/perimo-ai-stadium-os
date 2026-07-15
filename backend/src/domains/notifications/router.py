"""Notification Engine routes (v1, auth-protected)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from src.domains.notifications.schema import Notification, NotificationsOverview
from src.domains.notifications.service import NotificationService
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_notification_service(request: Request) -> NotificationService:
    return request.app.state.notification_service


@router.get("", response_model=NotificationsOverview)
async def list_notifications(
    _user: UserPublic = Depends(require_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationsOverview:
    return service.overview()


@router.post("/{notification_id}/read", response_model=Notification)
async def mark_read(
    notification_id: str,
    _user: UserPublic = Depends(require_user),
    service: NotificationService = Depends(get_notification_service),
) -> Notification:
    return service.mark_read(notification_id)


@router.post("/read-all", response_model=NotificationsOverview)
async def mark_all_read(
    _user: UserPublic = Depends(require_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationsOverview:
    return service.mark_all_read()
