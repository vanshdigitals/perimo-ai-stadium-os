"""FastAPI application factory for PERIMO Backend V2.

Wires the composition root (stores + services), mounts versioned domain routers
under the ``/v1`` prefix, and maps the typed error taxonomy to HTTP responses.

The original wayfinding endpoints (``/api/assist``, ``/api/stadium``) are retained
unchanged for backward compatibility — Backend V2 grows around the wayfinding
kernel rather than replacing it.
"""

from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.bootstrap.container import build_container
from src.config.logging import get_logger
from src.config.settings import Settings, get_settings
from src.core.errors import AppError
from src.security.auth.router import router as auth_router
from src.domains.facilities.router import router as facilities_router
from src.domains.crowd.router import router as crowd_router
from src.domains.incidents.router import router as incidents_router
from src.domains.notifications.router import router as notifications_router
from src.domains.resources.router import router as resources_router
from src.domains.transportation.router import router as transport_router
from src.domains.live_ops.router import router as live_ops_router
from src.platform.websocket.gateway import router as ws_router, wire_eventbus
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

logger = get_logger("perimo")

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
        title="PERIMO",
        description="PERIMO — AI Stadium Operating System. Backend V2 platform API.",
        version="2.0.0",
    )

    # --- Composition root: stores + domain services on app.state ---
    container = build_container(settings)
    app.state.settings = settings
    app.state.store = container.store
    app.state.event_bus = container.event_bus
    app.state.auth_service = container.auth_service
    app.state.facilities_service = container.facilities_service
    app.state.crowd_service = container.crowd_service
    app.state.incident_service = container.incident_service
    app.state.notification_service = container.notification_service
    app.state.resource_service = container.resource_service
    app.state.transport_service = container.transport_service
    app.state.live_ops_service = container.live_ops_service

    # Wire event bus → WebSocket fan-out
    wire_eventbus(container.event_bus)

    # --- Wayfinding kernel singletons (retained from V1) ---
    app.state.stadium = get_stadium()
    app.state.llm = get_llm_client(settings)
    app.state.rate_limiter = RateLimiter(
        settings.rate_limit_capacity, settings.rate_limit_refill_per_sec
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )

    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        for header, value in _SECURITY_HEADERS.items():
            response.headers.setdefault(header, value)
        return response

    # --- Typed error taxonomy → HTTP ---
    @app.exception_handler(AppError)
    async def _app_error_handler(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message}},
        )

    @app.exception_handler(RouteNotFound)
    async def _route_not_found_handler(request: Request, exc: RouteNotFound):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    # --- System routes ---
    @app.get("/health", response_model=HealthResponse, tags=["system"])
    async def health() -> HealthResponse:
        return HealthResponse(status="ok")

    @app.get("/ready", tags=["system"])
    async def ready(request: Request) -> dict:
        store_kind = type(request.app.state.store).__name__
        return {
            "status": "ok",
            "store": store_kind,
            "llm_live": bool(getattr(request.app.state.llm, "is_live", False)),
        }

    # --- V1 platform routers ---
    api = settings.api_v1_prefix
    app.include_router(auth_router, prefix=api)
    app.include_router(facilities_router, prefix=api)
    app.include_router(crowd_router, prefix=api)
    app.include_router(incidents_router, prefix=api)
    app.include_router(notifications_router, prefix=api)
    app.include_router(resources_router, prefix=api)
    app.include_router(transport_router, prefix=api)
    app.include_router(live_ops_router, prefix=api)
    app.include_router(ws_router, prefix=api)

    # --- Wayfinding kernel routes (retained) ---
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
