"""Tests for system/observability endpoints (health, readiness, telemetry)."""

from __future__ import annotations


def test_health_ok(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_ready_reports_store_and_llm(client):
    res = client.get("/ready")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert "store" in body
    # Offline test config → MockLLM, so the live flag is False.
    assert body["llm_live"] is False


def test_monitoring_returns_system_health(client):
    res = client.get("/monitoring")
    assert res.status_code == 200
    assert isinstance(res.json(), dict)


def test_analytics_endpoint_available(client):
    res = client.get("/analytics")
    assert res.status_code == 200
    assert isinstance(res.json(), (dict, list))


def test_audit_log_endpoint_available(client):
    res = client.get("/audit")
    assert res.status_code == 200
    assert isinstance(res.json(), (dict, list))


def test_security_headers_on_system_route(client):
    res = client.get("/ready")
    assert res.headers["X-Content-Type-Options"] == "nosniff"
    assert res.headers["X-Frame-Options"] == "DENY"


def test_unknown_route_returns_404(client):
    assert client.get("/v1/this-does-not-exist").status_code == 404
