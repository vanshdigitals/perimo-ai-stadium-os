"""WebSocket gateway tests — auth enforcement and the subscribe protocol."""

from __future__ import annotations

import pytest
from starlette.websockets import WebSocketDisconnect

from tests.conftest import login_token


def test_ws_rejects_missing_token(client):
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/v1/ws"):
            pass


def test_ws_rejects_invalid_token(client):
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/v1/ws?token=not-a-real-token"):
            pass


def test_ws_authenticated_subscribe_acks(client):
    token = login_token(client, "admin")
    with client.websocket_connect(f"/v1/ws?token={token}") as ws:
        ws.send_json({"action": "subscribe", "rooms": ["crowd", "incidents"]})
        ack = ws.receive_json()
        assert ack["ack"] == "subscribed"
        assert set(ack["rooms"]) == {"crowd", "incidents"}


def test_ws_unsubscribe_acks(client):
    token = login_token(client, "staff")
    with client.websocket_connect(f"/v1/ws?token={token}") as ws:
        ws.send_json({"action": "subscribe", "rooms": ["crowd"]})
        ws.receive_json()
        ws.send_json({"action": "unsubscribe", "rooms": ["crowd"]})
        ack = ws.receive_json()
        assert ack["ack"] == "unsubscribed"


def test_ws_invalid_json_is_reported_not_fatal(client):
    token = login_token(client, "fan")
    with client.websocket_connect(f"/v1/ws?token={token}") as ws:
        ws.send_text("this is not json")
        err = ws.receive_json()
        assert err["error"] == "invalid_json"
