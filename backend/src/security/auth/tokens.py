"""JWT access/refresh token minting and verification (HMAC / HS256 via PyJWT).

Access tokens are short-lived and stateless (verified on the hot path with no
store lookup). Refresh tokens are longer-lived; the service persists a session
record so refresh tokens can be revoked (logout / sign-out-everywhere).
"""

from __future__ import annotations

import time
import uuid

import jwt

from src.config.settings import Settings
from src.core.errors import AuthenticationError

_ACCESS = "access"
_REFRESH = "refresh"


def _encode(settings: Settings, *, subject: str, token_type: str, ttl: int, **claims: object) -> str:
    now = int(time.time())
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + ttl,
        "jti": uuid.uuid4().hex,
        **claims,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def mint_access_token(settings: Settings, *, user_id: str, role: str) -> str:
    return _encode(
        settings,
        subject=user_id,
        token_type=_ACCESS,
        ttl=settings.access_token_ttl_seconds,
        role=role,
    )


def mint_refresh_token(settings: Settings, *, user_id: str, session_id: str) -> str:
    return _encode(
        settings,
        subject=user_id,
        token_type=_REFRESH,
        ttl=settings.refresh_token_ttl_seconds,
        sid=session_id,
    )


def _decode(settings: Settings, token: str, *, expected_type: str) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Token has expired.", code="token_expired") from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationError("Invalid token.", code="token_invalid") from exc
    if payload.get("type") != expected_type:
        raise AuthenticationError("Wrong token type.", code="token_invalid")
    return payload


def decode_access_token(settings: Settings, token: str) -> dict:
    return _decode(settings, token, expected_type=_ACCESS)


def decode_refresh_token(settings: Settings, token: str) -> dict:
    return _decode(settings, token, expected_type=_REFRESH)
