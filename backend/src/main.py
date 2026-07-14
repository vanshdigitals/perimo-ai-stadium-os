"""FastAPI application: routes, middleware, static UI, and app factory.

Endpoints:
  * ``GET  /``            → the accessible single-page UI
  * ``GET  /health``      → liveness probe (no LLM)
  * ``POST /api/assist``  → context-aware assistance (rate-limited)
  * ``GET  /api/stadium`` → zone/facility metadata for the UI
"""

from __future__ import annotations

from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config.settings import Settings, get_settings
from src.config.logging import get_logger
from src.schemas.user_context import (
    AccessibilityNeed,
    AssistResponse,
    DestinationIntent,
    HealthResponse,
    Language,
    UserContext,
)
from src.context_engine.engine import RouteNotFound, run_assist
from src.utils.llm import get_llm_client
from src.security.rate_limiter import RateLimiter
from src.api.controllers.stadium_data import Stadium, get_stadium

logger = get_logger("stadiummate")



_SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": (
        "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; "
        "connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
    ),
}


def _stadium_metadata(stadium: Stadium) -> dict:
    """Serialize zones/facilities and enum vocabularies for the front-end."""
    return {
        "stadium": {
            "name": stadium.name,
            "fifa_name": stadium.fifa_name,
            "city": stadium.city,
            "capacity": stadium.capacity,
        },
        # `name`/`landmark` are localized maps ({en,es,fr}); the UI picks the language.
        "zones": [
            {"id": z.id, "name": z.names, "type": z.type, "level": z.level}
            for z in stadium.zones.values()
        ],
        "facilities": [
            {
                "id": f.id,
                "name": f.names,
                "type": f.type,
                "zone": f.zone,
                "accessible": f.accessible,
                "landmark": f.landmarks,
            }
            for f in stadium.facilities
        ],
        "intents": [i.value for i in DestinationIntent],
        "languages": [lang.value for lang in Language],
        "accessibility_needs": [n.value for n in AccessibilityNeed],
    }


def _rate_limit_dependency(request: Request) -> None:
    """Reject requests that exceed the per-IP token-bucket budget with 429."""
    limiter: RateLimiter = request.app.state.rate_limiter
    client_ip = request.client.host if request.client else "unknown"
    allowed, retry_after = limiter.check(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please slow down.",
            headers={"Retry-After": str(int(retry_after) + 1)},
        )


def create_app(settings: Settings | None = None) -> FastAPI:
    """Application factory. Accepts an explicit ``settings`` (used by tests)."""
    settings = settings or get_settings()

    app = FastAPI(
        title="StadiumMate",
        description="Multilingual, accessible stadium assistant for FIFA World Cup 2026.",
        version="1.0.0",
    )

    # Shared, startup-time singletons (fixtures loaded once; LLM chosen once).
    app.state.settings = settings
    app.state.stadium = get_stadium()
    app.state.llm = get_llm_client(settings)
    app.state.rate_limiter = RateLimiter(
        settings.rate_limit_capacity, settings.rate_limit_refill_per_sec
    )

    # Restrictive CORS: explicit allow-list only.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        for header, value in _SECURITY_HEADERS.items():
            response.headers.setdefault(header, value)
        return response

    @app.exception_handler(RouteNotFound)
    async def _route_not_found_handler(request: Request, exc: RouteNotFound):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.get("/health", response_model=HealthResponse, tags=["system"])
    async def health() -> HealthResponse:
        return HealthResponse(status="ok")

    @app.get("/api/stadium", tags=["data"])
    async def stadium_metadata(request: Request) -> dict:
        return _stadium_metadata(request.app.state.stadium)

    @app.post(
        "/api/assist",
        response_model=AssistResponse,
        dependencies=[Depends(_rate_limit_dependency)],
        tags=["assist"],
    )
    async def assist(ctx: UserContext, request: Request) -> AssistResponse:
        stadium: Stadium = request.app.state.stadium
        llm = request.app.state.llm
        response = await run_assist(ctx, stadium, llm)
        # Privacy-preserving log: intents/zones/outcome only — never the question.
        logger.info(
            "assist location=%s intent=%s needs=%s crowd=%s used_llm=%s",
            ctx.current_location,
            ctx.destination_intent.value,
            "+".join(n.value for n in ctx.accessibility_needs),
            response.crowd_level.value,
            response.used_llm,
        )
        return response



    return app


# Module-level ASGI app for `uvicorn src.main:app`.
app = create_app()
