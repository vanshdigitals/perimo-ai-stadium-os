"""Cross-cutting error taxonomy for PERIMO Backend V2.

Domain services raise these typed errors; a single set of handlers in the app
factory maps them to HTTP responses. This keeps routers thin and guarantees a
consistent, non-leaky error envelope across every module.
"""

from __future__ import annotations


class AppError(Exception):
    """Base class for all expected, mapped application errors.

    ``status_code`` drives the HTTP response; ``code`` is a stable machine-readable
    slug the frontend can switch on; ``message`` is safe to show to a user.
    """

    status_code: int = 400
    code: str = "app_error"

    def __init__(self, message: str, *, code: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        if code:
            self.code = code


class NotFoundError(AppError):
    status_code = 404
    code = "not_found"


class ValidationError(AppError):
    status_code = 422
    code = "validation_error"


class ConflictError(AppError):
    status_code = 409
    code = "conflict"


class AuthenticationError(AppError):
    status_code = 401
    code = "unauthenticated"


class AuthorizationError(AppError):
    status_code = 403
    code = "forbidden"


class RateLimitError(AppError):
    status_code = 429
    code = "rate_limited"
