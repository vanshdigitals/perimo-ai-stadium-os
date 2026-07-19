"""Phase 3 domain tests — Transportation, Live Operations, WebSocket, Event Bus."""

from __future__ import annotations

import asyncio
import json

import pytest
from starlette.testclient import TestClient

from src.main import create_app
from src.config.settings import Settings
from src.platform.eventbus.bus import DomainEvent, EventBus, IncidentEvent

_EMAIL = "admin@perimo.io"
_PASSWORD = "Admin@123"


# ---------- Fixtures ----------------------------------------------------------

@pytest.fixture
def client() -> TestClient:
    return TestClient(
        create_app(
            Settings(
                gemini_api_key=None,
                jwt_secret="test-secret-must-be-32-bytes-long-for-hs256",
                seed_admin_email=_EMAIL,
                seed_admin_password=_PASSWORD,
                allowed_origins=["http://testserver"],
            )
        )
    )


@pytest.fixture
def auth_token(client: TestClient) -> str:
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": _PASSWORD})
    challenge = r.json()["challenge_token"]
    r2 = client.post("/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "123456"})
    return r2.json()['access_token']

@pytest.fixture
def auth_headers(auth_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {auth_token}"}


# ---------- Event Bus ---------------------------------------------------------

class TestEventBus:
    def test_publish_subscribe(self) -> None:
        bus = EventBus()
        received: list[DomainEvent] = []

        async def handler(event: DomainEvent) -> None:
            received.append(event)

        bus.subscribe("incident", handler)
        event = IncidentEvent(payload={"id": "INC-001", "status": "Open"})
        asyncio.run(bus.publish(event))

        assert len(received) == 1
        assert received[0].payload["id"] == "INC-001"

    def test_prefix_matching(self) -> None:
        bus = EventBus()
        received: list[str] = []

        async def handler(event: DomainEvent) -> None:
            received.append(event.event_type)

        bus.subscribe("incident", handler)  # matches incident.*
        asyncio.run(bus.publish(DomainEvent(event_type="incident.reported")))
        asyncio.run(bus.publish(DomainEvent(event_type="crowd.level_changed")))

        assert received == ["incident.reported"]

    def test_subscriber_error_does_not_propagate(self) -> None:
        bus = EventBus()

        async def bad_handler(_event: DomainEvent) -> None:
            raise ValueError("boom")

        async def good_handler(event: DomainEvent) -> None:
            event.payload["reached"] = True

        bus.subscribe("test", bad_handler)
        bus.subscribe("test", good_handler)

        ev = DomainEvent(event_type="test.event")
        asyncio.run(bus.publish(ev))
        assert ev.payload.get("reached") is True


# ---------- Transportation API -----------------------------------------------

class TestTransportation:
    def test_overview_requires_auth(self, client: TestClient) -> None:
        r = client.get("/v1/transport/overview")
        assert r.status_code == 401

    def test_overview_shape(self, client: TestClient, auth_headers: dict) -> None:
        r = client.get("/v1/transport/overview", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert "parking" in data
        assert "shuttles" in data
        assert "roads" in data
        assert "transit_events" in data
        assert "insights" in data
        assert "summary" in data
        assert len(data["parking"]) == 4
        assert len(data["shuttles"]) == 4
        assert data["summary"]["general_parking_pct"] == 84

    def test_parking_lots_match_frontend(self, client: TestClient, auth_headers: dict) -> None:
        r = client.get("/v1/transport/overview", headers=auth_headers)
        lots = r.json()["parking"]
        lot_names = [lot["lot"] for lot in lots]
        assert "Lot A (North)" in lot_names
        assert "VIP Premium" in lot_names


# ---------- Live Operations API -----------------------------------------------

class TestLiveOps:
    def test_overview_requires_auth(self, client: TestClient) -> None:
        r = client.get("/v1/live-ops/overview")
        assert r.status_code == 401

    def test_overview_shape(self, client: TestClient, auth_headers: dict) -> None:
        r = client.get("/v1/live-ops/overview", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert "systems" in data
        assert "crowd_zones" in data
        assert "event_feed" in data
        assert "operator_log" in data
        assert "insights" in data
        assert "summary" in data
        assert len(data["systems"]) == 5
        assert data["summary"]["gates_open"] == 18
        assert data["summary"]["match_status"] == "In Progress — 68'"

    def test_event_feed_contains_incidents(self, client: TestClient, auth_headers: dict) -> None:
        r = client.get("/v1/live-ops/overview", headers=auth_headers)
        events = r.json()["event_feed"]
        assert any("Gate C" in e["title"] for e in events)


# ---------- WebSocket Gateway -------------------------------------------------

class TestWebSocket:
    def test_ws_connect_and_ping(self, client: TestClient, auth_token: str) -> None:
        with client.websocket_connect(f"/v1/ws?token={auth_token}") as ws:
            ws.send_text(json.dumps({"action": "ping"}))
            data = ws.receive_json()
            assert data == {"ack": "pong"}

    def test_ws_subscribe_and_unsubscribe(self, client: TestClient, auth_token: str) -> None:
        with client.websocket_connect(f"/v1/ws?token={auth_token}") as ws:
            ws.send_text(json.dumps({"action": "subscribe", "rooms": ["crowd", "incidents"]}))
            data = ws.receive_json()
            assert data["ack"] == "subscribed"
            assert set(data["rooms"]) == {"crowd", "incidents"}

            ws.send_text(json.dumps({"action": "unsubscribe", "rooms": ["crowd"]}))
            data = ws.receive_json()
            assert data["ack"] == "unsubscribed"

    def test_ws_unknown_action_returns_error(self, client: TestClient, auth_token: str) -> None:
        with client.websocket_connect(f"/v1/ws?token={auth_token}") as ws:
            ws.send_text(json.dumps({"action": "bogus"}))
            data = ws.receive_json()
            assert "error" in data

    def test_ws_invalid_json_returns_error(self, client: TestClient, auth_token: str) -> None:
        with client.websocket_connect(f"/v1/ws?token={auth_token}") as ws:
            ws.send_text("not valid json{{{")
            data = ws.receive_json()
            assert "error" in data
