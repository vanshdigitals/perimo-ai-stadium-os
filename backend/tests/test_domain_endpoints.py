"""Breadth tests: every protected domain read endpoint enforces auth and works.

One parametrized pass asserts each endpoint rejects anonymous callers (401);
a second asserts it returns 200 with a valid bearer token.
"""

from __future__ import annotations

import pytest

# Auth-protected GET endpoints across every stadium domain.
PROTECTED_GETS = [
    "/v1/crowd/overview",
    "/v1/facilities/overview",
    "/v1/incidents",
    "/v1/incidents/overview",
    "/v1/transport/overview",
    "/v1/live-ops/overview",
    "/v1/notifications",
    "/v1/resources",
    "/v1/fan/home",
]


@pytest.mark.parametrize("path", PROTECTED_GETS)
def test_requires_authentication(client, path):
    assert client.get(path).status_code == 401


@pytest.mark.parametrize("path", PROTECTED_GETS)
def test_returns_ok_with_token(client, admin_headers, path):
    res = client.get(path, headers=admin_headers)
    assert res.status_code == 200


def test_invalid_bearer_token_rejected(client):
    res = client.get("/v1/crowd/overview", headers={"Authorization": "Bearer garbage.token.value"})
    assert res.status_code == 401


def test_fan_home_shape(client, fan_headers):
    body = client.get("/v1/fan/home", headers=fan_headers).json()
    for key in ("greeting", "weather", "ticketPreview", "status", "quickActions", "recommendations", "schedule"):
        assert key in body
    assert isinstance(body["quickActions"], list) and body["quickActions"]
