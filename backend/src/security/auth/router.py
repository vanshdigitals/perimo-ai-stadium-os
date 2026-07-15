"""Authentication routes (mounted under the v1 API prefix)."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from src.security.auth.dependencies import get_auth_service, require_user
from src.security.auth.schemas import (
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    MfaChallengeResponse,
    MfaVerifyRequest,
    PasswordForgotRequest,
    RefreshRequest,
    TokenResponse,
    UserPublic,
)
from src.security.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse | MfaChallengeResponse)
async def login(body: LoginRequest, auth: AuthService = Depends(get_auth_service)):
    result = auth.login(body.email, body.password)
    if isinstance(result, str):
        return MfaChallengeResponse(challenge_token=result)
    return result


@router.post("/mfa/verify", response_model=TokenResponse)
async def verify_mfa(body: MfaVerifyRequest, auth: AuthService = Depends(get_auth_service)):
    return auth.verify_mfa(body.challenge_token, body.code)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest, auth: AuthService = Depends(get_auth_service)):
    return auth.refresh(body.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(body: LogoutRequest, auth: AuthService = Depends(get_auth_service)):
    auth.logout(body.refresh_token)
    return MessageResponse(message="Signed out.")


@router.post("/password/forgot", response_model=MessageResponse)
async def password_forgot(body: PasswordForgotRequest):
    # Privacy: always return the same response whether or not the email exists.
    return MessageResponse(message="If that account exists, a reset link has been sent.")


@router.get("/me", response_model=UserPublic)
async def me(user: UserPublic = Depends(require_user)):
    return user
