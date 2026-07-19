"""Shared pytest fixtures.

Every fixture forces the offline configuration: no Gemini key (so the app uses
:class:`~app.services.llm.MockLLM`) and a generous rate limit so functional tests
are never throttled. Individual tests override these as needed.
"""

from __future__ import annotations

from collections.abc import Callable

import pytest
from starlette.testclient import TestClient

from src.config.settings import Settings
from src.main import create_app


def _settings(**overrides) -> Settings:
    params = {
        "gemini_api_key": None,  # highest-priority override → always offline MockLLM
        "rate_limit_capacity": 1000,
        "rate_limit_refill_per_sec": 1000.0,
        "allowed_origins": ["http://testserver"],
    }
    params.update(overrides)
    return Settings(**params)


@pytest.fixture
def settings() -> Settings:
    return _settings()


@pytest.fixture
def client(settings: Settings) -> TestClient:
    return TestClient(create_app(settings))


@pytest.fixture
def make_client() -> Callable[..., TestClient]:
    """Factory to build a TestClient with custom settings (e.g. low rate limit)."""

    def _make(**overrides) -> TestClient:
        return TestClient(create_app(_settings(**overrides)))

    return _make


@pytest.fixture
def base_payload() -> dict:
    """A minimal valid ``/api/assist`` request body."""
    return {
        "language": "en",
        "current_location": "concourse_lower_sw",
        "destination_intent": "restroom",
        "accessibility_needs": ["none"],
        "minutes_to_kickoff": 20,
    }


# --- Authentication helpers (shared across API/permission tests) -------------

# Seeded credentials (see src/bootstrap/container.py). The admin uses MFA; the
# demo operators (staff/volunteer/fan) sign in directly.
ADMIN_EMAIL = "admin@perimo.io"
ADMIN_PASSWORD = "Admin@123"
DEMO_PASSWORD = "Perimo!2026"
ROLE_EMAILS = {
    "admin": ADMIN_EMAIL,
    "staff": "staff@perimo.io",
    "volunteer": "volunteer@perimo.io",
    "fan": "fan@perimo.io",
}


def login_token(client: TestClient, role: str = "admin") -> str:
    """Return a valid access token for the given seeded role."""
    email = ROLE_EMAILS[role]
    if role == "admin":
        challenge = client.post(
            "/v1/auth/login", json={"email": email, "password": ADMIN_PASSWORD}
        ).json()["challenge_token"]
        res = client.post(
            "/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "123456"}
        )
    else:
        res = client.post("/v1/auth/login", json={"email": email, "password": DEMO_PASSWORD})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


def auth_headers(client: TestClient, role: str = "admin") -> dict[str, str]:
    return {"Authorization": f"Bearer {login_token(client, role)}"}


@pytest.fixture
def admin_headers(client: TestClient) -> dict[str, str]:
    return auth_headers(client, "admin")


@pytest.fixture
def fan_headers(client: TestClient) -> dict[str, str]:
    return auth_headers(client, "fan")
