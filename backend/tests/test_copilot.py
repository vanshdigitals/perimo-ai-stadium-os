"""Tests for the AI Operations Copilot (offline fallback, contract, RBAC)."""

from __future__ import annotations

import asyncio

import pytest

from src.domains.copilot.schema import Classification, DashboardContext
from src.domains.copilot.service import CopilotService
from tests.conftest import auth_headers

_REC_KEYS = {
    "id", "timestamp", "status", "title", "explanation", "whyItMatters",
    "confidence", "recommendedAction", "estimatedImpact", "classification",
}


def _ctx(**over) -> dict:
    body = {"timestamp": "2026-07-19T20:00:00Z", "thermalAnomalies": 0}
    body.update(over)
    return body


def test_health_is_public_and_well_formed(client):
    res = client.get("/v1/copilot/health")
    assert res.status_code == 200
    body = res.json()
    assert set(body) == {"status", "circuit_state", "using_backup", "failure_count"}


def test_recommendations_requires_auth(client):
    assert client.post("/v1/copilot/recommendations", json=_ctx()).status_code == 401


def test_recommendations_forbidden_for_fan(client):
    res = client.post("/v1/copilot/recommendations", json=_ctx(), headers=auth_headers(client, "fan"))
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "insufficient_role"


def test_recommendations_allowed_for_staff(client):
    res = client.post("/v1/copilot/recommendations", json=_ctx(), headers=auth_headers(client, "staff"))
    assert res.status_code == 200


def test_recommendations_offline_returns_grounded_list(client, admin_headers):
    ctx = _ctx(
        thermalAnomalies=2,
        crowdCongestion=[{"zone": "North", "density": "high"}],
        unitStatus={"busy": 5, "available": 1},
        gateStatus=[{"id": "A", "name": "Gate A", "waitLevel": "high"}],
    )
    res = client.post("/v1/copilot/recommendations", json=ctx, headers=admin_headers)
    assert res.status_code == 200
    recs = res.json()
    assert isinstance(recs, list) and len(recs) >= 1
    for rec in recs:
        assert _REC_KEYS <= set(rec)
        assert 0.0 <= rec["confidence"] <= 1.0
        assert rec["status"] == "PENDING"
    # The error-leak path must never appear in a response.
    assert "details" not in " ".join(str(r) for r in recs)


def test_recommendations_nominal_when_no_signals(client, admin_headers):
    res = client.post("/v1/copilot/recommendations", json=_ctx(), headers=admin_headers)
    assert res.status_code == 200
    titles = [r["title"] for r in res.json()]
    assert any("nominal" in t.lower() for t in titles)


def test_malformed_context_rejected(client, admin_headers):
    # Missing required 'timestamp' → 422 validation error.
    res = client.post("/v1/copilot/recommendations", json={"thermalAnomalies": 1}, headers=admin_headers)
    assert res.status_code == 422


def test_service_fallback_prioritises_safety():
    svc = CopilotService()
    ctx = DashboardContext.model_validate({"timestamp": "t", "thermalAnomalies": 3})
    recs = asyncio.run(svc.recommend(ctx))
    assert recs[0].classification == Classification.safety
    assert recs[0].confidence > 0


def test_negative_thermal_anomalies_rejected():
    with pytest.raises(ValueError):
        DashboardContext.model_validate({"timestamp": "t", "thermalAnomalies": -1})
