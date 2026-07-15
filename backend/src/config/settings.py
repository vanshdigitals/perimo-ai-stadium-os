"""Application configuration.

Settings are loaded from environment variables (and an optional ``.env`` file)
via ``pydantic-settings``. Secrets are **never** hard-coded here.

This is the PERIMO Backend V2 settings surface. It stays backward-compatible with
the original wayfinding fields (Gemini, CORS, rate limiting) and adds the V2
platform fields (JWT auth, Firestore, API versioning). Every new subsystem
degrades gracefully when its config is absent:

  * No ``firestore_project_id`` → the in-memory/seeded document store is used
    (the same offline-first philosophy the LLM layer already follows).
  * No ``gemini_api_key`` → the offline MockLLM is used.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed, validated application settings.

    Every field can be overridden by an environment variable of the same
    (upper-cased) name, e.g. ``JWT_SECRET`` or ``FIRESTORE_PROJECT_ID``.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "PERIMO"

    # --- API surface ---
    api_v1_prefix: str = "/v1"

    # --- Gemini (optional; absence triggers the MockLLM fallback) ---
    gemini_api_key: str | None = Field(default=None, description="Google Gemini API key.")
    backup_gemini_api_key: str | None = Field(default=None, description="Backup Google Gemini API key.")
    gemini_model: str = Field(default="gemini-1.5-flash")
    gemini_max_output_tokens: int = Field(default=256, ge=16, le=2048)

    # --- Firestore (optional; absence triggers the in-memory seeded store) ---
    firestore_project_id: str | None = Field(
        default=None,
        description="GCP project id. When unset, an offline seeded document store is used.",
    )
    firestore_emulator_host: str | None = Field(
        default=None, description="Set to use the Firestore emulator (e.g. localhost:8080)."
    )

    # --- Authentication (JWT) ---
    jwt_secret: str = Field(
        default="dev-insecure-change-me",
        description="HMAC signing secret for access/refresh tokens. MUST be overridden in prod.",
    )
    jwt_algorithm: str = Field(default="HS256")
    access_token_ttl_seconds: int = Field(default=15 * 60, ge=60)
    refresh_token_ttl_seconds: int = Field(default=7 * 24 * 3600, ge=300)

    # --- Seed admin (bootstraps an operator so the existing login UI works) ---
    # Defaults match the frontend dev credentials so the current admin login UI
    # obtains a real backend token out of the box. Override in production via env.
    seed_admin_email: str = Field(default="admin@perimo.io")
    seed_admin_password: str = Field(default="Admin@123")
    seed_admin_name: str = Field(default="Stadium Administrator")

    # --- HTTP security ---
    allowed_origins: list[str] = Field(
        default=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5182",
            "http://127.0.0.1:5182",
        ],
        description="Explicit CORS allow-list. Local Vite dev origins by default.",
    )

    # --- Rate limiting (token bucket, per client IP) ---
    rate_limit_capacity: int = Field(default=30, ge=1)
    rate_limit_refill_per_sec: float = Field(default=0.5, ge=0.0)

    @property
    def gemini_enabled(self) -> bool:
        """True when a non-empty Gemini API key is configured."""
        return bool(self.gemini_api_key and self.gemini_api_key.strip())

    @property
    def firestore_enabled(self) -> bool:
        """True when Firestore should back the document store (project id or emulator)."""
        return bool(self.firestore_project_id or self.firestore_emulator_host)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a process-wide cached :class:`Settings` instance."""
    return Settings()
