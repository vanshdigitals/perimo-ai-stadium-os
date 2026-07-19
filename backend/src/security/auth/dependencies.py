"""FastAPI dependencies for authentication and authorization.

``get_auth_service`` wires the service from app state; ``require_user`` extracts and
verifies the bearer access token, returning the current user. ``require_role``
builds on ``require_user`` to enforce role-based access control on a route.
"""

from __future__ import annotations

from collections.abc import Callable

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.core.errors import AuthenticationError, AuthorizationError
from src.security.auth.schemas import UserPublic, UserRole
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


def require_role(*roles: UserRole) -> Callable[[UserPublic], UserPublic]:
    """Return a dependency that requires the current user to hold one of ``roles``.

    Layers on top of :func:`require_user`, so an unauthenticated caller still gets
    a 401; an authenticated caller lacking the role gets a 403.
    """
    allowed = frozenset(roles)

    def _dependency(user: UserPublic = Depends(require_user)) -> UserPublic:
        if user.role not in allowed:
            raise AuthorizationError(
                "You do not have permission to perform this action.",
                code="insufficient_role",
            )
        return user

    return _dependency
