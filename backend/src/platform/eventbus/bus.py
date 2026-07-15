"""In-process event bus — the architectural spine for domain decoupling.

Domain services publish typed events; subscribers (WebSocket fan-out, audit,
notifications, analytics) react without direct cross-domain imports.
"""

from __future__ import annotations

import asyncio
import logging
from collections import defaultdict
from typing import Any, Callable, Coroutine

from pydantic import BaseModel, Field
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class DomainEvent(BaseModel):
    """Base class for every domain event in the system."""

    event_type: str
    venue_id: str = "default"
    actor_id: str = "system"
    occurred_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    payload: dict[str, Any] = Field(default_factory=dict)


# Concrete event subtypes

class IncidentEvent(DomainEvent):
    event_type: str = "incident.updated"

class CrowdEvent(DomainEvent):
    event_type: str = "crowd.level_changed"

class ResourceEvent(DomainEvent):
    event_type: str = "resource.status_changed"

class NotificationEvent(DomainEvent):
    event_type: str = "notification.new"

class TransportEvent(DomainEvent):
    event_type: str = "transport.updated"

class TwinDeltaEvent(DomainEvent):
    event_type: str = "twin.delta"


# Subscriber signature: async callable receiving a DomainEvent
Subscriber = Callable[[DomainEvent], Coroutine[Any, Any, None]]


class EventBus:
    """Thread-safe, in-process pub/sub event bus.

    Subscribers are async callables registered per event_type prefix.
    Publishing is fire-and-forget (errors in subscribers are logged, not raised).
    """

    def __init__(self) -> None:
        self._subscribers: dict[str, list[Subscriber]] = defaultdict(list)

    def subscribe(self, event_type: str, handler: Subscriber) -> None:
        """Register *handler* for events whose ``event_type`` starts with *event_type*."""
        self._subscribers[event_type].append(handler)
        logger.info("EventBus: subscribed %s to '%s'.", handler.__name__, event_type)

    async def publish(self, event: DomainEvent) -> None:
        """Fan out *event* to all matching subscribers (by prefix match)."""
        logger.debug("EventBus: publishing %s", event.event_type)
        for prefix, handlers in self._subscribers.items():
            if event.event_type.startswith(prefix):
                for handler in handlers:
                    try:
                        await handler(event)
                    except Exception:
                        logger.exception(
                            "EventBus: subscriber %s failed on %s",
                            handler.__name__,
                            event.event_type,
                        )

    def publish_sync(self, event: DomainEvent) -> None:
        """Convenience wrapper that schedules publish on the running event loop.

        Safe to call from synchronous service code — the actual fan-out happens
        asynchronously on the event loop. Falls back to a new loop if none exists.
        """
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(self.publish(event))
        except RuntimeError:
            # No running loop — run synchronously (e.g. in tests)
            asyncio.run(self.publish(event))
