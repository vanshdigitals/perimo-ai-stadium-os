"""Incident lifecycle + error-handling tests (create → assign → escalate → resolve)."""

from __future__ import annotations


def test_create_incident_returns_201(client, admin_headers):
    body = {"title": "Smoke reported in Sector 4", "location": "Sector 4", "severity": "High"}
    res = client.post("/v1/incidents", json=body, headers=admin_headers)
    assert res.status_code == 201
    created = res.json()
    assert created["title"] == body["title"]
    assert created["severity"] == "High"
    assert created["status"] == "Open"
    assert created["id"]


def test_created_incident_appears_in_list(client, admin_headers):
    body = {"title": "Barrier down at Gate B", "location": "Gate B", "severity": "Medium"}
    created = client.post("/v1/incidents", json=body, headers=admin_headers).json()
    ids = {i["id"] for i in client.get("/v1/incidents", headers=admin_headers).json()}
    assert created["id"] in ids


def test_assign_then_escalate_then_resolve(client, admin_headers):
    created = client.post(
        "/v1/incidents",
        json={"title": "Medical assist needed", "location": "Concourse", "severity": "Low"},
        headers=admin_headers,
    ).json()
    iid = created["id"]

    assigned = client.post(f"/v1/incidents/{iid}/assign", json={"assigned": "Team-3"}, headers=admin_headers)
    assert assigned.status_code == 200
    assert assigned.json()["assigned"] == "Team-3"

    escalated = client.post(f"/v1/incidents/{iid}/escalate", headers=admin_headers)
    assert escalated.status_code == 200

    resolved = client.patch(f"/v1/incidents/{iid}", json={"status": "Resolved"}, headers=admin_headers)
    assert resolved.status_code == 200
    assert resolved.json()["status"] == "Resolved"


def test_overview_returns_summary(client, admin_headers):
    res = client.get("/v1/incidents/overview", headers=admin_headers)
    assert res.status_code == 200
    assert "severity_distribution" in res.json()


# --- error handling ---


def test_assign_unknown_incident_returns_404(client, admin_headers):
    res = client.post("/v1/incidents/nope-123/assign", json={"assigned": "T1"}, headers=admin_headers)
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "incident_not_found"


def test_escalate_unknown_incident_returns_404(client, admin_headers):
    res = client.post("/v1/incidents/nope-123/escalate", headers=admin_headers)
    assert res.status_code == 404


def test_patch_unknown_incident_returns_404(client, admin_headers):
    res = client.patch("/v1/incidents/nope-123", json={"status": "Resolved"}, headers=admin_headers)
    assert res.status_code == 404


def test_create_incident_validation_error(client, admin_headers):
    # Empty title and unknown severity → 422.
    res = client.post(
        "/v1/incidents",
        json={"title": "", "location": "X", "severity": "Apocalyptic"},
        headers=admin_headers,
    )
    assert res.status_code == 422


def test_invalid_status_transition_rejected(client, admin_headers):
    created = client.post(
        "/v1/incidents",
        json={"title": "Test", "location": "X", "severity": "Low"},
        headers=admin_headers,
    ).json()
    res = client.patch(f"/v1/incidents/{created['id']}", json={"status": "Sleeping"}, headers=admin_headers)
    assert res.status_code == 422
