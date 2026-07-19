"""Tests for the Facilities domain (auth-protected overview endpoint)."""

from __future__ import annotations

from starlette.testclient import TestClient

from src.config.settings import Settings
from src.main import create_app

_EMAIL = "admin@perimo.io"
_PASSWORD = "PerimoAdmin!2026"


def _client() -> TestClient:
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


def _token(client: TestClient) -> str:
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": _PASSWORD})
    challenge = r.json()["challenge_token"]
    r2 = client.post("/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "123456"})
    return r2.json()["access_token"]


def test_overview_requires_auth() -> None:
    client = _client()
    assert client.get("/v1/facilities/overview").status_code == 401


def test_overview_shape_matches_frontend_contract() -> None:
    client = _client()
    headers = {"Authorization": f"Bearer {_token(client)}"}
    r = client.get("/v1/facilities/overview", headers=headers)
    assert r.status_code == 200
    body = r.json()

    # Power block
    assert body["power"]["load_mw"] == 42.5
    assert body["power"]["trend"] == [38, 40, 41, 42.5, 43, 42.8, 42.5]

    # HVAC / water
    assert len(body["hvac_zones"]) == 4
    assert body["water_systems"][3]["status"] == "Degraded"

    # Maintenance: 5 requests, 3 open (2 dispatched + 1 queued... actually 4 open)
    assert len(body["maintenance"]) == 5
    open_count = sum(1 for m in body["maintenance"] if m["status"] != "Resolved")
    assert body["summary"]["open_maintenance"] == open_count

    # Cleaning schedule + summary
    assert len(body["cleaning_schedule"]) == 4
    assert body["summary"]["avg_core_temp_f"] == 72
    assert body["summary"]["sanitation"] == "All systems nominal"


def test_maintenance_open_items_sorted_first() -> None:
    client = _client()
    headers = {"Authorization": f"Bearer {_token(client)}"}
    body = client.get("/v1/facilities/overview", headers=headers).json()
    statuses = [m["status"] for m in body["maintenance"]]
    # Resolved items must not appear before any open item.
    last_open = max(i for i, s in enumerate(statuses) if s != "Resolved")
    first_resolved = min((i for i, s in enumerate(statuses) if s == "Resolved"), default=len(statuses))
    assert first_resolved > last_open
