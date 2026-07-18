# Phase 1 — Backend Compatibility Audit (read-only)

**Date:** 2026-07-18
**Rule for this phase:** audit only — no code changed. This is the baseline for productionizing the **existing FastAPI backend** toward the agreed target (FastAPI → PostgreSQL → Redis → GCS → Gemini → Cloud Run, fronted by Vercel).
**Verified by:** direct source reading of `PERIMO/backend/src/` at commit `d88bb17`.

---

## 1. Current APIs (as mounted in `src/main.py`)

| Area | Prefix | Endpoints | Auth |
|---|---|---|---|
| System | — | `GET /health`, `GET /ready`, `GET /monitoring`, `GET /analytics`, `GET /audit` | none |
| Auth | `/v1/auth` | `POST /login`, `POST /mfa/verify`, `POST /refresh`, `POST /logout`, `POST /password/forgot`, `GET /me` | JWT (except login/refresh) |
| Facilities | `/v1/facilities` | `GET /overview` | bearer |
| Crowd | `/v1/crowd` | `GET /overview` | bearer |
| Incidents | `/v1/incidents` | `GET ""`, `GET /overview`, `POST ""`, `PATCH /{id}`, `POST /{id}/assign`, `POST /{id}/escalate` | bearer |
| Notifications | `/v1/notifications` | `GET ""`, `POST /{id}/read`, `POST /read-all` | bearer |
| Resources | `/v1/resources` | `GET ""`, `POST /{id}/assign` | bearer |
| Transport | `/v1/transport` | `GET /overview` | bearer |
| Live-Ops | `/v1/live-ops` | `GET /overview` | bearer |
| Copilot (AI) | `/v1/copilot` | `POST /recommendations`, `GET /health` | bearer |
| Realtime | `/v1/ws` | WebSocket (token in query; `subscribe`/`unsubscribe`/`ping`) | JWT via `auth_service.current_user(token)` |
| Wayfinding kernel | `/api` | `GET /api/stadium`, `POST /api/assist` | rate-limited |

**Every one of these is consumed by the frontend today** (admin pages + the copilot widget), so their **response shapes are frozen contracts** — Phase 2 must not change them.

## 2. Current models
- **Pydantic v2 schemas only** — one `schema.py` per domain (`Incident`, `IncidentOverview`, `Notification`, `ResourceUnit`, `ZoneRow`, `FacilitiesOverview`, `TransportOverview`, `LiveOpsOverview`, auth `User`/`Session`/`TokenResponse`, etc.).
- **No ORM.** No SQLAlchemy models, no table definitions, no relationships. Documents are plain dicts validated by Pydantic.

## 3. Current services & structure
- Clean 4-layer per domain: `schema.py` (contracts) → `repository.py` (data access over `DocumentStore`) → `service.py` (rules; publishes domain events) → `router.py` (thin HTTP).
- Composition root `bootstrap/container.py` wires stores + services onto `app.state`.
- Domains present: **facilities, crowd, incidents, notifications, resources, transportation, live_ops, copilot**.

## 4. Current authentication
- **JWT** access + refresh (PyJWT, HS256) via `security/auth/`; **MFA** challenge step; **PBKDF2** password hashing; refresh **sessions** persisted in the store (revocable on logout).
- **Limitation:** session records + the rate limiter live in the **in-memory store** → lost on restart, and not shared across instances.

## 5. Current realtime capability — **present**
- `platform/eventbus/bus.py`: in-process `EventBus`; domain services already `publish_sync(...)` on create/assign/escalate/read/etc.
- `platform/websocket/gateway.py`: authenticated `/v1/ws`, `ConnectionRegistry` with room subscribe/unsubscribe, `ping`→`pong`, dead-connection cleanup, and an event-bus fan-out (`incident|crowd|resource|transport|twin|notification|ai|system` → rooms).
- **Limitation:** the registry is a **single-process, in-memory singleton** — with >1 Cloud Run instance, an event on instance A won't reach sockets on instance B (needs Redis pub/sub for horizontal fan-out).

## 6. Current AI — **server-side (Gemini already moved off the frontend)**
- `platform/ai/manager.py`: `GeminiServiceManager` with circuit breaker (OPEN/HALF_OPEN/CLOSED), exponential backoff, **backup key failover**, health polling.
- `/v1/copilot/recommendations` accepts live dashboard context and returns AI recommendations; frontend `GeminiRecommendationService.ts` was refactored to call this endpoint.
- **Result:** Phase 5's core objective (no Gemini key in the browser) is **already largely satisfied**. Remaining: confirm no `VITE_GEMINI_API_KEY` usage remains in shipped frontend code, and source keys from Secret Manager in prod.

## 7. Current storage — **the primary gap**
- `platform/firestore/store.py`: `DocumentStore` ABC with **`MemoryStore`** (seeded from `src/database/seed/*.json`, default) and a `FirestoreStore` adapter (optional, unused).
- **No PostgreSQL, no SQLAlchemy, no Alembic, no Redis, no GCS.** All data is process-memory fixtures → **lost on restart**, single-process only.

## 8. Current limitations (ranked)
1. **Persistence (P0):** in-memory seeded fixtures. No durable DB. → **Phase 2**.
2. **Missing domains (P0):** no **Staff / Volunteer / Fan** backend at all; several admin areas (`analytics`, `audit`, `monitoring`) are thin `system` stubs, not full domains. → **Phase 3**.
3. **Horizontal-scale state (P1):** sessions, rate limiter, and WS registry are per-process/in-memory → need Redis (or a shared store) for multi-instance Cloud Run.
4. **Cloud packaging (P1):** **no `Dockerfile`/`.dockerignore`** in `backend/`, no health-check wiring for Cloud Run, no GCS, no Secret Manager, no structured Cloud Logging. → **Phase 6**.
5. **Config gaps (P1):** settings have `gemini_*`, `firestore_*`, `jwt_*`, `allowed_origins` — but **no `database_url`, `redis_url`, `gcs_bucket`, or Secret Manager sourcing**.

## 9. Frontend compatibility contract (must be preserved through Phase 2)
The frontend depends on these exact response shapes (do not change them when swapping storage): all `/overview` composite payloads (facilities, crowd, incidents, notifications, resources, transport, live-ops), the incidents CRUD/transition responses, auth token/`/me` responses, and the copilot recommendations array. Phase 2 swaps the store *beneath* the repositories; repositories keep returning the same Pydantic models → **zero frontend change required**.

## 10. Readiness verdict
- **Already done (by prior work / concurrent agent):** JWT auth, event bus, **WebSocket gateway (Phase 4)**, **server-side Gemini manager (Phase 5)**, 8 admin-facing domains wired to the frontend, hardened frontend API client (timeouts/retry).
- **Not started:** **Phase 2 (PostgreSQL persistence)**, **Phase 3 (Staff/Volunteer/Fan domains)**, **Phase 6 (Cloud Run/Docker/GCS/Secret Manager)**.
- **Recommended next:** **Phase 2** — introduce SQLAlchemy + Alembic + a Postgres-backed `DocumentStore`/repository implementation *behind the existing interface*, keeping `MemoryStore` as the offline/test default so nothing regresses and the frontend contracts stay frozen.

---

*Audit only. No backend code was modified in this phase.*
