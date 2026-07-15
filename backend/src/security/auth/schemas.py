"""Pydantic contracts for the Authentication module."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class UserRole(StrEnum):
    admin = "admin"
    staff = "staff"
    volunteer = "volunteer"
    fan = "fan"


class UserStatus(StrEnum):
    active = "active"
    suspended = "suspended"


class User(BaseModel):
    """Stored user record. ``password_hash`` never leaves the repository layer."""

    id: str
    email: str
    display_name: str
    role: UserRole = UserRole.admin
    status: UserStatus = UserStatus.active
    password_hash: str
    mfa_enabled: bool = True


class UserPublic(BaseModel):
    """User projection safe to return to clients (no password hash)."""

    id: str
    email: str
    display_name: str
    role: UserRole
    status: UserStatus


class Session(BaseModel):
    """Refresh-session record — enables refresh-token revocation."""

    id: str
    user_id: str
    created_at: str
    expires_at: str
    revoked: bool = False


# --- Requests ---


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: str
    password: str = Field(min_length=1, max_length=128)


class MfaVerifyRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    challenge_token: str
    code: str = Field(min_length=4, max_length=8)


class RefreshRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    refresh_token: str


class LogoutRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    refresh_token: str


class PasswordForgotRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: str


# --- Responses ---


class MfaChallengeResponse(BaseModel):
    """First step of login when MFA is enabled: credentials OK, code required."""

    mfa_required: bool = True
    challenge_token: str


class TokenResponse(BaseModel):
    """Successful authentication: access + refresh tokens and the user."""

    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: UserPublic


class MessageResponse(BaseModel):
    message: str
