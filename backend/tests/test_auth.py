"""Tests for the Authentication module (login → MFA → tokens → refresh → logout)."""

from __future__ import annotations

from starlette.testclient import TestClient

from src.config.settings import Settings
from src.main import create_app

_EMAIL = "admin@perimo.io"
_PASSWORD = "PerimoAdmin!2026"


def _app() -> TestClient:
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


def _login_to_tokens(client: TestClient) -> dict:
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": _PASSWORD})
    assert r.status_code == 200
    body = r.json()
    assert body["mfa_required"] is True
    challenge = body["challenge_token"]
    r2 = client.post("/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "123456"})
    assert r2.status_code == 200
    return r2.json()


def test_login_requires_mfa_then_issues_tokens() -> None:
    client = _app()
    tokens = _login_to_tokens(client)
    assert tokens["access_token"]
    assert tokens["refresh_token"]
    assert tokens["user"]["email"] == _EMAIL
    assert "password_hash" not in tokens["user"]


def test_bad_password_rejected() -> None:
    client = _app()
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": "wrong"})
    assert r.status_code == 401
    assert r.json()["error"]["code"] == "invalid_credentials"


def test_wrong_mfa_code_rejected() -> None:
    client = _app()
    r = client.post("/v1/auth/login", json={"email": _EMAIL, "password": _PASSWORD})
    challenge = r.json()["challenge_token"]
    r2 = client.post("/v1/auth/mfa/verify", json={"challenge_token": challenge, "code": "999999"})
    assert r2.status_code == 401
    assert r2.json()["error"]["code"] == "mfa_failed"


def test_me_requires_bearer_token() -> None:
    client = _app()
    assert client.get("/v1/auth/me").status_code == 401
    tokens = _login_to_tokens(client)
    r = client.get("/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert r.status_code == 200
    assert r.json()["role"] == "admin"


def test_refresh_and_logout() -> None:
    client = _app()
    tokens = _login_to_tokens(client)
    r = client.post("/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 200
    assert r.json()["access_token"]

    # Logout revokes the session → subsequent refresh fails.
    assert client.post("/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]}).status_code == 200
    r2 = client.post("/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r2.status_code == 401
    assert r2.json()["error"]["code"] == "session_revoked"
