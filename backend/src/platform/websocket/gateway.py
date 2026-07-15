"""WebSocket gateway — authenticated, room-based live event push.

One gateway endpoint (``/v1/ws``) that upgrades to a persistent connection,
accepts room subscriptions, and forwards domain events from the event bus
to connected clients in the matching rooms.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.platform.eventbus.bus import DomainEvent, EventBus

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionRegistry:
    """Tracks connected WebSocket clients and their room subscriptions."""

    def __init__(self) -> None:
        self._connections: dict[WebSocket, set[str]] = {}

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self._connections[ws] = set()
        logger.info("WS: client connected (%d total).", len(self._connections))

    def disconnect(self, ws: WebSocket) -> None:
        self._connections.pop(ws, None)
        logger.info("WS: client disconnected (%d remaining).", len(self._connections))

    def subscribe(self, ws: WebSocket, rooms: list[str]) -> None:
        if ws in self._connections:
            self._connections[ws].update(rooms)
            logger.debug("WS: client subscribed to rooms %s.", rooms)

    def unsubscribe(self, ws: WebSocket, rooms: list[str]) -> None:
        if ws in self._connections:
            self._connections[ws].difference_update(rooms)

    async def broadcast(self, room: str, data: dict[str, Any]) -> None:
        """Send *data* to every client subscribed to *room*."""
        dead: list[WebSocket] = []
        for ws, rooms in self._connections.items():
            if room in rooms:
                try:
                    await ws.send_json(data)
                except Exception:
                    dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    @property
    def count(self) -> int:
        return len(self._connections)


# Module-level singleton wired at app startup
registry = ConnectionRegistry()

# Room mapping: event_type prefix → room name
_EVENT_ROOM_MAP: dict[str, str] = {
    "incident": "incidents",
    "crowd": "crowd",
    "resource": "resources",
    "transport": "transport",
    "twin": "twin",
    "notification": "notifications",
    "ai": "system",
    "system": "system",
}


def _room_for_event(event_type: str) -> str | None:
    """Resolve a domain event type to a WebSocket room name."""
    prefix = event_type.split(".")[0]
    return _EVENT_ROOM_MAP.get(prefix)


async def ws_fanout_subscriber(event: DomainEvent) -> None:
    """Event bus subscriber that broadcasts domain events to WS rooms."""
    room = _room_for_event(event.event_type)
    if room is None:
        return
    await registry.broadcast(room, {
        "type": event.event_type,
        "payload": event.payload,
        "timestamp": event.occurred_at,
    })


def wire_eventbus(event_bus: EventBus) -> None:
    """Subscribe the WS fan-out to all relevant event prefixes."""
    for prefix in _EVENT_ROOM_MAP:
        event_bus.subscribe(prefix, ws_fanout_subscriber)


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    """WebSocket endpoint — accepts subscribe/unsubscribe/ping messages."""
    await registry.connect(ws)
    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_json({"error": "invalid_json"})
                continue

            action = msg.get("action")
            if action == "subscribe":
                rooms = msg.get("rooms", [])
                registry.subscribe(ws, rooms)
                await ws.send_json({"ack": "subscribed", "rooms": rooms})
            elif action == "unsubscribe":
                rooms = msg.get("rooms", [])
                registry.unsubscribe(ws, rooms)
                await ws.send_json({"ack": "unsubscribed", "rooms": rooms})
            elif action == "ping":
                await ws.send_json({"ack": "pong"})
            else:
                await ws.send_json({"error": "unknown_action"})
    except WebSocketDisconnect:
        registry.disconnect(ws)
