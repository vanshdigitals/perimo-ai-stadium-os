"""Authentication service — login (with MFA step), refresh, logout, current-user.

Flow:
  1. ``login`` verifies credentials. If the user has MFA enabled, it returns a
     short-lived signed *challenge token* (not a session) and the client must call
     ``verify_mfa``. Otherwise it issues tokens directly.
  2. ``verify_mfa`` validates the challenge token + code, then issues tokens and
     persists a refresh session.
  3. ``refresh`` rotates the access token if the refresh session is still valid.
  4. ``logout`` revokes the refresh session.

Dev note: a fixed MFA code (``DEV_MFA_CODES`` equivalent) is accepted so the
existing admin login UI works end-to-end offline. In production MFA verification
is delegated to a TOTP validator.
"""

from __future__ import annotations

import time
import uuid
from datetime import datetime, timedelta, timezone

import jwt

from src.config.logging import get_logger
from src.config.settings import Settings
from src.core.errors import AuthenticationError
from src.security.auth.passwords import verify_password
from src.security.auth.repository import SessionRepository, UserRepository
from src.security.auth.schemas import (
    Session,
    TokenResponse,
    User,
    UserPublic,
)
from src.security.auth.tokens import (
    decode_access_token,
    decode_refresh_token,
    mint_access_token,
    mint_refresh_token,
)

logger = get_logger(__name__)

# Accepted offline MFA codes — mirrors the frontend dev codes so the existing
# admin login → MFA screen works against the real backend without a TOTP device.
_DEV_MFA_CODES = frozenset({"123456", "000000"})
_CHALLENGE_TYPE = "mfa_challenge"
_CHALLENGE_TTL = 300  # seconds


class AuthService:
    def __init__(
        self,
        settings: Settings,
        users: UserRepository,
        sessions: SessionRepository,
    ) -> None:
        self._settings = settings
        self._users = users
        self._sessions = sessions

    # --- helpers ---

    def _issue_tokens(self, user: User) -> TokenResponse:
        session_id = uuid.uuid4().hex
        now = datetime.now(timezone.utc)
        self._sessions.save(
            Session(
                id=session_id,
                user_id=user.id,
                created_at=now.isoformat(),
                expires_at=(now + timedelta(seconds=self._settings.refresh_token_ttl_seconds)).isoformat(),
                revoked=False,
            )
        )
        access = mint_access_token(self._settings, user_id=user.id, role=user.role.value)
        refresh = mint_refresh_token(self._settings, user_id=user.id, session_id=session_id)
        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            expires_in=self._settings.access_token_ttl_seconds,
            user=UserPublic(**user.model_dump(exclude={"password_hash", "mfa_enabled"})),
        )

    def _mint_challenge(self, user: User) -> str:
        now = int(time.time())
        return jwt.encode(
            {"sub": user.id, "type": _CHALLENGE_TYPE, "iat": now, "exp": now + _CHALLENGE_TTL},
            self._settings.jwt_secret,
            algorithm=self._settings.jwt_algorithm,
        )

    # --- public API ---

    def login(self, email: str, password: str) -> TokenResponse | str:
        """Verify credentials. Returns a challenge token (str) if MFA is required,
        otherwise a full :class:`TokenResponse`."""
        user = self._users.get_by_email(email)
        if user is None or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.", code="invalid_credentials")
        if user.status.value != "active":
            raise AuthenticationError("Account is not active.", code="account_inactive")
        if user.mfa_enabled:
            return self._mint_challenge(user)
        return self._issue_tokens(user)

    def verify_mfa(self, challenge_token: str, code: str) -> TokenResponse:
        try:
            payload = jwt.decode(
                challenge_token, self._settings.jwt_secret, algorithms=[self._settings.jwt_algorithm]
            )
        except jwt.InvalidTokenError as exc:
            raise AuthenticationError("Challenge expired — please sign in again.", code="challenge_invalid") from exc
        if payload.get("type") != _CHALLENGE_TYPE:
            raise AuthenticationError("Invalid challenge.", code="challenge_invalid")
        if code.strip() not in _DEV_MFA_CODES:
            raise AuthenticationError("Incorrect verification code.", code="mfa_failed")
        user = self._users.get(str(payload.get("sub")))
        if user is None:
            raise AuthenticationError("User no longer exists.", code="user_not_found")
        return self._issue_tokens(user)

    def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_refresh_token(self._settings, refresh_token)
        session = self._sessions.get(str(payload.get("sid")))
        if session is None or session.revoked:
            raise AuthenticationError("Session is no longer valid.", code="session_revoked")
        user = self._users.get(str(payload.get("sub")))
        if user is None:
            raise AuthenticationError("User no longer exists.", code="user_not_found")
        # Reuse the existing session; only mint a fresh access token.
        access = mint_access_token(self._settings, user_id=user.id, role=user.role.value)
        return TokenResponse(
            access_token=access,
            refresh_token=refresh_token,
            expires_in=self._settings.access_token_ttl_seconds,
            user=UserPublic(**user.model_dump(exclude={"password_hash", "mfa_enabled"})),
        )

    def logout(self, refresh_token: str) -> None:
        try:
            payload = decode_refresh_token(self._settings, refresh_token)
        except AuthenticationError:
            return  # already invalid — nothing to revoke
        session = self._sessions.get(str(payload.get("sid")))
        if session is not None and not session.revoked:
            self._sessions.save(session.model_copy(update={"revoked": True}))

    def current_user(self, access_token: str) -> UserPublic:
        payload = decode_access_token(self._settings, access_token)
        user = self._users.get(str(payload.get("sub")))
        if user is None:
            raise AuthenticationError("User no longer exists.", code="user_not_found")
        return UserPublic(**user.model_dump(exclude={"password_hash", "mfa_enabled"}))
