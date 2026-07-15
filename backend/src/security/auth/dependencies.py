"""FastAPI dependencies for authentication.

``get_auth_service`` wires the service from app state; ``require_user`` extracts and
verifies the bearer access token, returning the current user. Routers add
``Depends(require_user)`` to protect a route (the RBAC module will layer permission
checks on top of this in a later phase).
"""

from __future__ import annotations

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.core.errors import AuthenticationError
from src.security.auth.schemas import UserPublic
from src.security.auth.service import AuthService

_bearer = HTTPBearer(auto_error=False)


def get_auth_service(request: Request) -> AuthService:
    return request.app.state.auth_service


def require_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    auth: AuthService = Depends(get_auth_service),
) -> UserPublic:
    if credentials is None or not credentials.credentials:
        raise AuthenticationError("Authentication required.", code="missing_token")
    return auth.current_user(credentials.credentials)
