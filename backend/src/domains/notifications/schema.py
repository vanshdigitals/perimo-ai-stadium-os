"""Contracts for the Notification Engine.

Matches the frontend admin Notifications page (and the header bell) shapes.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel


class NotificationCategory(StrEnum):
    critical = "critical"
    warning = "warning"
    info = "info"
    resolved = "resolved"


class Notification(BaseModel):
    id: str
    title: str
    description: str
    category: NotificationCategory
    time: str
    read: bool = False
    action: str | None = None


class NotificationMetaDoc(BaseModel):
    id: str = "current"
    resolved_today: int


class NotificationsSummary(BaseModel):
    unread: int
    critical: int
    warning: int
    resolved_today: int


class NotificationsOverview(BaseModel):
    notifications: list[Notification]
    summary: NotificationsSummary
