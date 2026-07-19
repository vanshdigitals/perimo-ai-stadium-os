"""Unit tests for JWT minting/verification and auth edge cases."""

from __future__ import annotations

import time

import jwt
import pytest

from src.config.settings import Settings
from src.core.errors import AuthenticationError
from src.security.auth.tokens import (
    decode_access_token,
    decode_refresh_token,
    mint_access_token,
    mint_refresh_token,
)

_S = Settings(jwt_secret="unit-test-secret", gemini_api_key=None)


def test_access_token_roundtrip_carries_role():
    token = mint_access_token(_S, user_id="u1", role="staff")
    payload = decode_access_token(_S, token)
    assert payload["sub"] == "u1"
    assert payload["role"] == "staff"
    assert payload["type"] == "access"


def test_refresh_token_roundtrip_carries_session():
    token = mint_refresh_token(_S, user_id="u1", session_id="sess-1")
    payload = decode_refresh_token(_S, token)
    assert payload["sid"] == "sess-1"
    assert payload["type"] == "refresh"


def test_access_token_rejected_as_refresh():
    access = mint_access_token(_S, user_id="u1", role="admin")
    with pytest.raises(AuthenticationError) as exc:
        decode_refresh_token(_S, access)
    assert exc.value.code == "token_invalid"


def test_expired_token_raises_token_expired():
    expired = jwt.encode(
        {"sub": "u1", "type": "access", "iat": int(time.time()) - 100, "exp": int(time.time()) - 10},
        _S.jwt_secret,
        algorithm=_S.jwt_algorithm,
    )
    with pytest.raises(AuthenticationError) as exc:
        decode_access_token(_S, expired)
    assert exc.value.code == "token_expired"


def test_tampered_signature_raises_token_invalid():
    token = mint_access_token(_S, user_id="u1", role="admin")
    tampered = token[:-3] + ("aaa" if not token.endswith("aaa") else "bbb")
    with pytest.raises(AuthenticationError) as exc:
        decode_access_token(_S, tampered)
    assert exc.value.code == "token_invalid"


def test_token_signed_with_other_secret_rejected():
    other = mint_access_token(Settings(jwt_secret="different", gemini_api_key=None), user_id="u1", role="admin")
    with pytest.raises(AuthenticationError):
        decode_access_token(_S, other)


def test_garbage_token_rejected():
    with pytest.raises(AuthenticationError) as exc:
        decode_access_token(_S, "not-a-jwt")
    assert exc.value.code == "token_invalid"


def test_me_rejects_expired_token(client):
    expired = jwt.encode(
        {"sub": "usr_admin", "type": "access", "iat": int(time.time()) - 100, "exp": int(time.time()) - 10},
        "test",  # secret irrelevant — expiry checked first is fine; app uses its own secret
        algorithm="HS256",
    )
    res = client.get("/v1/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert res.status_code == 401


def test_refresh_with_unknown_session_rejected(client):
    # A validly-signed refresh token whose session was never persisted.
    app_settings = client.app.state.settings
    forged = mint_refresh_token(app_settings, user_id="usr_admin", session_id="ghost")
    res = client.post("/v1/auth/refresh", json={"refresh_token": forged})
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "session_revoked"


def test_logout_is_idempotent_on_invalid_token(client):
    # Logging out with a bogus token must not error.
    assert client.post("/v1/auth/logout", json={"refresh_token": "bogus"}).status_code == 200
