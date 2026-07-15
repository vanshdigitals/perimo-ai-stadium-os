"""Notification Engine service — list, summary, and read-state mutations."""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.platform.eventbus.bus import EventBus, NotificationEvent
from src.domains.notifications.repository import (
    NotificationMetaRepository,
    NotificationRepository,
)
from src.domains.notifications.schema import (
    Notification,
    NotificationCategory,
    NotificationsOverview,
    NotificationsSummary,
)

# Newest first — the seed ids are ordered n1 (newest) → n6 (oldest).
_ORDER = {f"n{i}": i for i in range(1, 100)}


class NotificationService:
    def __init__(self, notifications: NotificationRepository, meta: NotificationMetaRepository, event_bus: EventBus | None = None) -> None:
        self._notifications = notifications
        self._meta = meta
        self._event_bus = event_bus

    def _publish(self, event_type: str, notification: Notification) -> None:
        if self._event_bus:
            self._event_bus.publish_sync(
                NotificationEvent(
                    event_type=event_type,
                    payload={"id": notification.id, "read": notification.read}
                )
            )

    def _sorted(self) -> list[Notification]:
        return sorted(self._notifications.list(), key=lambda n: _ORDER.get(n.id, 999))

    def _summary(self, items: list[Notification]) -> NotificationsSummary:
        meta = self._meta.get("current")
        return NotificationsSummary(
            unread=sum(1 for n in items if not n.read),
            critical=sum(1 for n in items if n.category == NotificationCategory.critical),
            warning=sum(1 for n in items if n.category == NotificationCategory.warning),
            resolved_today=meta.resolved_today if meta else 0,
        )

    def overview(self) -> NotificationsOverview:
        items = self._sorted()
        return NotificationsOverview(notifications=items, summary=self._summary(items))

    def mark_read(self, notification_id: str) -> Notification:
        n = self._notifications.get(notification_id)
        if n is None:
            raise NotFoundError(f"Notification {notification_id} not found.", code="notification_not_found")
        if n.read:
            return n
        notification = self._notifications.save(n.model_copy(update={"read": True}))
        self._publish("notification.read", notification)
        return notification

    def mark_all_read(self) -> NotificationsOverview:
        for n in self._notifications.list():
            if not n.read:
                notification = self._notifications.save(n.model_copy(update={"read": True}))
                self._publish("notification.read", notification)
        return self.overview()
