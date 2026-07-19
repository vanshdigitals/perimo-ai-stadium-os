"""Role-based access control: multi-role login and permission enforcement."""

from __future__ import annotations

import pytest

from tests.conftest import ROLE_EMAILS, auth_headers


@pytest.mark.parametrize("role", ["admin", "staff", "volunteer", "fan"])
def test_every_seeded_role_can_authenticate(client, role):
    headers = auth_headers(client, role)
    me = client.get("/v1/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["role"] == role
    assert me.json()["email"] == ROLE_EMAILS[role]


def _one_incident_id(client, headers) -> str:
    incidents = client.get("/v1/incidents", headers=headers).json()
    assert incidents, "expected seeded incidents"
    return incidents[0]["id"]


@pytest.mark.parametrize("role", ["admin", "staff"])
def test_operators_can_escalate_incident(client, role):
    headers = auth_headers(client, role)
    iid = _one_incident_id(client, headers)
    assert client.post(f"/v1/incidents/{iid}/escalate", headers=headers).status_code == 200


@pytest.mark.parametrize("role", ["fan", "volunteer"])
def test_non_operators_cannot_escalate_incident(client, role):
    admin = auth_headers(client, "admin")
    iid = _one_incident_id(client, admin)
    res = client.post(f"/v1/incidents/{iid}/escalate", headers=auth_headers(client, role))
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "insufficient_role"


def test_fan_cannot_assign_incident(client):
    admin = auth_headers(client, "admin")
    iid = _one_incident_id(client, admin)
    res = client.post(
        f"/v1/incidents/{iid}/assign",
        json={"assigned": "unit-1"},
        headers=auth_headers(client, "fan"),
    )
    assert res.status_code == 403


def test_unauthenticated_escalate_is_401_not_403(client):
    admin = auth_headers(client, "admin")
    iid = _one_incident_id(client, admin)
    # Missing token → authentication error (401), checked before authorization.
    assert client.post(f"/v1/incidents/{iid}/escalate").status_code == 401
