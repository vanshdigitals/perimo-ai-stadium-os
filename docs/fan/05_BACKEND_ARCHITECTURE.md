# 05 · Backend Architecture — Fan domain (FastAPI)

**Reuse the existing backend.** Do not introduce a parallel framework. The Fan backend is a new domain package that follows the *established* PERIMO 4-layer pattern already used by `domains/{crowd,incidents,notifications,resources,transportation,live_ops,copilot}`.

## Established conventions to follow (verified in code)
- App factory in `src/main.py`; routers mounted under `settings.api_v1_prefix` (`/v1`).
- Composition root `src/bootstrap/container.py` builds repositories + services onto `app.state`.
- **4-layer per domain:** `schema.py` (Pydantic contracts) → `repository.py` (data access over `DocumentStore`) → `service.py` (rules; publishes `DomainEvent` to `EventBus`) → `router.py` (thin HTTP, `Depends(require_user)`).
- Persistence via `platform/firestore/store.py` `DocumentStore` (MemoryStore seeded from `database/seed/*.json` today; `SqlDocumentStore` is the Postgres target — `06_DATABASE_SCHEMA`).
- Auth via `security/auth` (JWT, `require_user`); realtime via `platform/eventbus` + `platform/websocket/gateway.py`; AI via `platform/ai/manager.py`.

## Folder structure (new)
```
backend/src/domains/fan/
├── __init__.py
├── schema.py            # all Pydantic request/response models (or split per concern)
├── home/            service.py · repository.py · router.py
├── match/           schema.py · repository.py · service.py · router.py
├── ticket/          …
├── navigation/      …            (may delegate to existing routing/ kernel)
├── food/            …
├── store/           …
├── media/           …
├── notifications/   …            (reuse existing notifications domain where possible)
├── profile/         …
├── settings/        …
└── emergency/       …
# One aggregating router `domains/fan/router.py` includes the sub-routers under /v1/fan
```

## Dependency injection
- Extend `Container` (dataclass in `bootstrap/container.py`) with `fan_*_service` fields; build them from repositories over the shared `store`.
- Wire the aggregate fan router: `app.include_router(fan_router, prefix=settings.api_v1_prefix + "/fan")`.
- Access in routers via `request.app.state.fan_<x>_service` (existing pattern) or a `Depends` getter.

## Repository pattern
- Reuse `platform/firestore/repository.py` `Repository[Model]` base (typed CRUD over `DocumentStore`).
- One repository per aggregate (matches, tickets, vendors, orders, products, media, …). Read models (e.g. `HomeOverview`) are **composed in the service** from multiple repositories — never a fat repo.

## Services
- Deterministic rules first (e.g. crowd-aware route selection reuses the existing `routing/` + `crowd` kernel). AI only for phrasing/recommendation via `ai_manager` — never for facts.
- Services **publish events** (`event_bus.publish_sync(DomainEvent(...))`) on state change (order status, emergency, match); the WS gateway fans them out.

## Validation
- Pydantic v2, `model_config = ConfigDict(extra="forbid")`, bounded/enumerated fields, server-side re-validation of anything client-supplied (seat, gate, vendor, quantities).

## Security
- Every fan router: `Depends(require_user)` + role check (`user.role == "fan"`). Ticket/QR validated server-side. Rate-limit write + assistant endpoints (existing token-bucket; Redis at scale). Details in `docs/FAN_EXPERIENCE_ARCHITECTURE §12` and `11_QA_CHECKLIST`.

## Caching
- In-process memoization for slow-changing reads (venue POIs, vendors, products) — mirror the `@lru_cache` fixture-load pattern. Add Redis read cache (keyed `fan:home:{user}`, short TTL) only after Postgres lands.

## Background jobs
- Match state ticker (advances minute/score in demo; real feed adapter later), order-status progression, notification fan-out, media ingestion — run in the existing jobs/worker seam (or a startup asyncio task for demo). Emit events on change.

## Testing
- Mirror the existing `tests/` style: `pytest` + `TestClient`, offline (MemoryStore), one file per fan sub-domain, contract assertions on every `/v1/fan/*` response shape. 100%-shape coverage before handoff to persistence swap.
