"""Tests for the Phase 2 domains: crowd, incidents, notifications, resources."""

from __future__ import annotations

import pytest
from starlette.testclient import TestClient

from src.config.settings import Settings
from src.main import create_app

_EMAIL = "admin@perimo.io"
_PASSWORD = "Admin@123"


@pytest.fixture
def client() -> TestClient:
    return TestClient(
        create_app(
            Settings(
                gemini_api_key=None,
                jwt_secret="test-secret",
                seed_admin_email=_EMAIL,
                seed_admin_password=_PASSWORD,
                allowed_origins=["http://testserver"],
            )
        )
    )


@pytest.fixture
def auth(client: TestClient) -> dict:
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": _PASSWORD})
    challenge = r.json()["challenge_token"]
    r2 = client.post("/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "123456"})
    return {"Authorization": f"Bearer {r2.json()['access_token']}"}


# --- Crowd ---

def test_crowd_overview(client: TestClient, auth: dict) -> None:
    assert client.get("/v1/crowd/overview").status_code == 401
    body = client.get("/v1/crowd/overview", headers=auth).json()
    assert len(body["zones"]) == 6
    # total occupancy derived from zones
    assert body["summary"]["total_occupancy"] == sum(z["occupancy"] for z in body["zones"])
    assert body["summary"]["congestion_critical"] == 1
    assert body["summary"]["congestion_elevated"] == 1
    assert body["summary"]["highest_density_zone"] == "Gate C Concourse"
    assert len(body["insights"]) == 3


# --- Incidents ---

def test_incident_overview_and_distribution(client: TestClient, auth: dict) -> None:
    body = client.get("/v1/incidents/overview", headers=auth).json()
    assert len(body["incidents"]) == 6
    assert body["summary"]["open_count"] == 4
    assert body["summary"]["critical_count"] == 1
    dist = body["severity_distribution"]
    assert dist == {"critical": 1, "high": 2, "medium": 1, "low": 2}


def test_incident_lifecycle(client: TestClient, auth: dict) -> None:
    # Create
    r = client.post(
        "/v1/incidents",
        headers=auth,
        json={"title": "Test spill", "location": "Sector C", "severity": "Low"},
    )
    assert r.status_code == 201
    inc = r.json()
    assert inc["status"] == "Open" and inc["assigned"] == "Unassigned"
    iid = inc["id"]

    # Assign → moves Open to Responding
    r2 = client.post(f"/v1/incidents/{iid}/assign", headers=auth, json={"assigned": "Team X"})
    assert r2.json()["status"] == "Responding"

    # Escalate Low→Medium (severity was Low)
    r3 = client.post(f"/v1/incidents/{iid}/escalate", headers=auth)
    assert r3.json()["severity"] == "Medium"

    # Illegal transition: Resolved is terminal
    client.patch(f"/v1/incidents/{iid}", headers=auth, json={"status": "Resolved"})
    r4 = client.patch(f"/v1/incidents/{iid}", headers=auth, json={"status": "Responding"})
    assert r4.status_code == 409
    assert r4.json()["error"]["code"] == "illegal_transition"


# --- Notifications ---

def test_notifications_overview_and_read(client: TestClient, auth: dict) -> None:
    body = client.get("/v1/notifications", headers=auth).json()
    assert len(body["notifications"]) == 6
    assert body["summary"]["unread"] == 4
    assert body["summary"]["critical"] == 2
    assert body["summary"]["warning"] == 1
    assert body["summary"]["resolved_today"] == 11

    # Mark one unread as read → unread drops to 3
    client.post("/v1/notifications/n1/read", headers=auth)
    body2 = client.get("/v1/notifications", headers=auth).json()
    assert body2["summary"]["unread"] == 3

    # Mark all read → unread 0
    after = client.post("/v1/notifications/read-all", headers=auth).json()
    assert after["summary"]["unread"] == 0


# --- Resources ---

def test_resources_list_and_assign(client: TestClient, auth: dict) -> None:
    body = client.get("/v1/resources", headers=auth).json()
    assert body["total"] == 12
    assert body["deployed"] == sum(1 for u in body["units"] if u["status"] != "offline")

    # Assign an offline unit → becomes busy
    r = client.post("/v1/resources/SEC-04/assign", headers=auth, json={"assignment": "Gate D"})
    assert r.status_code == 200
    assert r.json()["status"] == "busy"
    assert r.json()["assignment"] == "Gate D"
