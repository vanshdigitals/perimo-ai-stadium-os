# PERIMO Backend V2 — Architecture Blueprint

**Status:** Design proposal (no code — architecture only)
**Baseline / inspiration:** `smart-stadium` (StadiumMate) — [github.com/Jagadeesh9hub/smart-stadium](https://github.com/Jagadeesh9hub/smart-stadium)
**Relationship to baseline:** *inspired by, not copied.* We keep the two ideas that make the reference good (rules-before-LLM grounding; strict typed contracts) and rebuild everything else into a production, multi-tenant, real-time operations backend.

---

## 0. Design thesis

The reference backend is an excellent **demo kernel**: a stateless, single-process, single-venue, anonymous fan-wayfinding tool. Its brilliance is one architectural principle — **the LLM never makes decisions, it only phrases facts the rules engine already resolved** — plus disciplined Pydantic contracts. Everything else about it (no auth, no persistence, no real-time, no multi-tenancy, single-key LLM, in-memory-only state) is a scope ceiling, not a design to preserve.

PERIMO Backend V2 keeps the kernel and grows a **platform** around it:

| Principle carried forward | Why it survives |
|---|---|
| Rules/deterministic decisions **before** any LLM | The single best idea in the reference; makes the system auditable, testable, injection-proof, and cheap. |
| Strict typed request/response contracts (`extra="forbid"`, enums, validators) | Cheap defense-in-depth; keep and standardize across every module. |
| Graceful LLM degradation (never crash on model failure) | Correct instinct — but V2 upgrades it from "silent single-key fallback" to "monitored multi-key failover." |
| Everything else | **Redesigned.** The reference has no concept of users, roles, incidents, events, persistence, or real time. |

**Non-negotiable V2 properties:** multi-tenant (many venues/events), stateful with a real datastore (Firestore), real-time (WebSocket gateway + internal event bus), RBAC-gated, observable, and horizontally scalable.

---

## 1. Verdict on every existing module

Legend: **Keep** (port as-is) · **Refactor** (same responsibility, cleaner) · **Rewrite** (same goal, new implementation) · **Replace** (throw away, different approach) · **Split** (one → many) · **Merge** (many → one).

| Reference module | Responsibility | Verdict | V2 outcome |
|---|---|---|---|
| `app/main.py` (factory, routes, static mount) | App wiring | **Split** | Becomes `bootstrap/` (app factory + lifespan) + per-domain `routers/`. Static-mount removed (frontend is a separate SPA). |
| `app/config.py` (`Settings`) | Config | **Refactor** | Keep pydantic-settings, add per-domain nested settings (`AuthSettings`, `FirestoreSettings`, `GeminiSettings`, `MapsSettings`, `WeatherSettings`) and secret-manager sourcing. Fix stale docstrings. |
| `app/models/schemas.py` (one god-file) | Contracts | **Split** | One `schemas.py` → per-domain schema packages (`schemas/context.py`, `schemas/incident.py`, `schemas/auth.py`, …). Keep the validation *discipline*. |
| `app/services/context_engine.py` | Rules engine (wayfinding) | **Keep + Refactor** | The crown jewel. Keep the rules-first pipeline; refactor to depend on repositories (Firestore) instead of a global fixture singleton, so it becomes multi-venue. |
| `app/services/stadium_data.py` (JSON fixture loader) | Data access | **Replace** | JSON-fixture-in-memory singleton → **Firestore repository layer** with an in-process cache. Same query surface (`zones`, `neighbors`, `facilities_of_types`), new backing store. |
| `app/services/routing.py` (Dijkstra) | Pathfinding | **Keep + Refactor** | Algorithm is fine. Refactor to accept a venue-scoped graph and to precompute/cache per-venue all-pairs paths (perf at scale). |
| `app/services/crowd.py` (clock simulation) | Crowd | **Rewrite** | Clock-only simulation → **Crowd Intelligence engine** fed by live signals (sensors/mock feed) with the clock model as a *fallback*, not the sole source. Single source of truth for both `/assist` and the admin dashboard. |
| `app/services/phrasing.py` (EN/ES/FR templates) | Offline phrasing | **Keep** | Memoized pure templates; port unchanged. The offline path stays first-class. |
| `app/services/llm.py` (single-key Mock/Gemini) | LLM abstraction | **Replace** | Single-key strategy → **AI Service Manager + Gemini Failover** (multi-key pool, health monitor, retry queue, round-robin failover). Reuse the pattern PERIMO already built on the frontend. |
| `app/services/security.py` (sanitize + token bucket) | Security utils | **Split** | Split into `security/sanitize.py` (keep) + `security/rate_limit.py` (**refactor** to a pluggable store: in-memory for dev, Redis for prod so it survives multi-instance). |
| `app/logging_conf.py` | Logging | **Refactor** | Keep privacy-safe logging; upgrade to structured JSON logs + correlation/request IDs feeding the Monitoring module. |
| `tests/` (78 tests, offline) | Tests | **Keep + Split** | Keep the offline-first philosophy; split per new domain and add contract/integration tests against the Firestore emulator. |
| *(nothing)* | Auth, RBAC, WS, events, incidents, notifications, jobs, analytics, audit | **New** | See §3–§21. |

**One-line summary:** *Keep the rules engine and the phrasing templates almost verbatim; refactor config/logging/routing; rewrite crowd; replace the data layer and the LLM layer; split the god-schema and the security utils; and build ~15 entirely new modules the reference never had.*

---

## 2. Target folder structure

```
backend/
├── src/
│   ├── bootstrap/
│   │   ├── app.py                 # create_app() factory
│   │   ├── lifespan.py            # startup/shutdown: DB pool, event bus, jobs, WS
│   │   └── container.py           # dependency wiring (DI)
│   │
│   ├── config/
│   │   ├── settings.py            # root Settings (nested per-domain)
│   │   └── secrets.py             # Secret Manager / env sourcing
│   │
│   ├── core/                      # cross-cutting primitives (no domain logic)
│   │   ├── errors.py              # error taxonomy + handlers
│   │   ├── logging.py             # structured logging + correlation IDs
│   │   ├── pagination.py
│   │   ├── ids.py                 # ULID/UUID helpers
│   │   └── time.py
│   │
│   ├── platform/                 # infrastructure adapters
│   │   ├── firestore/            # client, base repository, tx helpers
│   │   ├── eventbus/             # in-proc bus + Pub/Sub adapter
│   │   ├── websocket/            # gateway, connection registry, rooms
│   │   ├── cache/                # Redis adapter (rate-limit, sessions, hot data)
│   │   ├── jobs/                 # scheduler + worker (background jobs)
│   │   ├── ai/                   # AI Service Manager + Gemini failover
│   │   ├── maps/                 # Google Maps adapter
│   │   └── weather/             # weather provider adapter
│   │
│   ├── security/
│   │   ├── sanitize.py
│   │   ├── rate_limit.py         # pluggable store (memory | redis)
│   │   ├── auth/                 # authN: tokens, MFA, password, sessions
│   │   └── rbac/                # authZ: roles, permissions, policy engine
│   │
│   ├── domains/                  # business modules (each = router+service+repo+schema)
│   │   ├── wayfinding/           # ← the reference's context_engine lives here
│   │   ├── crowd/
│   │   ├── incidents/
│   │   ├── notifications/
│   │   ├── transportation/
│   │   ├── resources/            # resource deployment
│   │   ├── digital_twin/
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── venues/               # multi-tenant venue/facility/zone registry
│   │   └── users/
│   │
│   ├── routers/                  # thin HTTP layer, one file per domain, versioned
│   │   └── v1/
│   │
│   └── main.py                   # ASGI entrypoint → bootstrap.app.create_app()
│
├── tests/                        # unit + contract + integration (Firestore emulator)
├── jobs/                         # standalone worker entrypoint (Cloud Run job)
├── Dockerfile · docker-compose.yml (emulators)
└── pyproject.toml · requirements.txt
```

**Rule of the tree:** `core` depends on nothing; `platform` depends on `core`; `security` depends on `core`+`platform`; `domains` depend on `core`+`platform`+`security`; `routers` depend on `domains`. No sideways or upward imports. This is the acyclic discipline the reference had by accident (it was small) made explicit and enforceable.

---

## 3. Service structure (the domain module template)

Every domain folder follows the **same four-layer shape**, so the codebase is uniform and a new module is a copy-paste of the skeleton:

```
domains/<name>/
├── schema.py       # Pydantic contracts (request/response/events) — extra="forbid"
├── repository.py   # Firestore access only (no business logic)
├── service.py      # business rules; emits domain events to the event bus
└── events.py       # typed event definitions this domain publishes/consumes
# HTTP handlers live in routers/v1/<name>.py and call service.py only
```

- **Routers** are thin: parse → authorize (RBAC dependency) → call service → serialize. No logic.
- **Services** own the rules, own the transaction boundary, and **publish events** rather than calling other domains directly (loose coupling via the event bus).
- **Repositories** are the only code that touches Firestore. Everything above them is testable with a fake repo.
- **The rules-before-LLM principle generalizes:** every AI-touching service resolves facts deterministically first, then optionally asks the AI Service Manager to phrase/summarize — never to decide.

---

## 4. New module — Authentication (`security/auth/`)

The reference has **zero** auth. V2 needs identity for four persona types already present in PERIMO's frontend (fan, volunteer, staff, admin).

- **Token model:** short-lived JWT access token (15 min) + rotating refresh token (persisted in Firestore, revocable). Stateless verification on the hot path; refresh/rotation hits the store.
- **MFA:** TOTP for staff/admin (matches the frontend's `AdminMFA` flow).
- **Password:** Argon2id hashing; reset via one-time signed tokens with short TTL (matches frontend reset flows).
- **Sessions:** device/session registry in Firestore for "sign out everywhere" and audit.
- **Graceful degradation carried over from the reference's spirit:** auth failures return typed, non-leaky errors; never 500 on a bad credential.

**Routes:** `POST /v1/auth/login`, `/refresh`, `/logout`, `/mfa/verify`, `/password/forgot`, `/password/reset`.

---

## 5. New module — RBAC (`security/rbac/`)

- **Model:** Role → Permission (many-to-many), User → Roles (many-to-many), optional per-venue role scoping (a user can be `staff` at Venue A only).
- **Permissions** are fine-grained verbs on resources: `incident:create`, `incident:assign`, `crowd:read`, `settings:write`, `audit:read`, …
- **Policy engine:** a single FastAPI dependency `requires(permission, scope="venue")` guards every router. Deny-by-default.
- **Storage:** roles/permissions in Firestore, hot-cached in Redis (rarely change), invalidated by an event on role edits.

**Routes:** `GET/POST /v1/roles`, `GET/POST /v1/permissions`, `POST /v1/users/{id}/roles`. (Backs the frontend's Roles & Permissions + User Management pages.)

---

## 6. New module — WebSocket Gateway (`platform/websocket/`)

The reference is pure request/response. V2's operations dashboards need live push.

- **One gateway**, authenticated on connect (JWT in the connection handshake), that upgrades to a persistent connection and joins **rooms** (`venue:{id}`, `venue:{id}:incidents`, `venue:{id}:crowd`, `user:{id}`).
- **Connection registry** tracks who's in which room; on multi-instance deploys this registry is backed by Redis pub/sub so a message published on instance A reaches sockets on instance B.
- **The gateway is a consumer of the internal event bus** — it does not contain business logic. Domain services publish events; a fan-out subscriber translates domain events into room broadcasts.

---

## 7. New module — Event Bus (`platform/eventbus/`)

The architectural spine that keeps domains decoupled.

- **In-process bus** (fast, ordered, for same-instance subscribers like the WS fan-out, audit logger, notification trigger).
- **Durable adapter** (Google Pub/Sub) for cross-instance and cross-service events, and for anything that must survive a crash (e.g. "incident escalated" must not be lost).
- **Every domain event is a typed Pydantic model** (`events.py` per domain), versioned, with a stable `event_type`, `venue_id`, `actor_id`, `occurred_at`, and payload.
- **Standard subscribers wired once:** Audit (log every state-changing event), Notifications (trigger sends), WebSocket (broadcast to rooms), Analytics (append to rollups).

This is why adding a feature is cheap: emit an event, and audit/notify/broadcast/analytics happen automatically.

---

## 8. New module — Incident Engine (`domains/incidents/`)

Entirely new — the reference has no incident concept (only `first_aid` as a wayfinding target).

- **Lifecycle state machine:** `reported → triaged → assigned → in_progress → resolved → closed` (with `escalated` as an orthogonal flag). Illegal transitions rejected at the service layer.
- **Rules-first, AI-second (the reference's principle applied to incidents):** severity scoring, SLA timers, and auto-assignment candidate ranking are **deterministic**; the AI Service Manager is used only to *summarize* an incident or *draft* a comms message — never to decide severity or assignment.
- **Emits events** at every transition (`incident.reported`, `incident.escalated`, …) → notifications + WS broadcast + audit happen via subscribers.
- **SLA breaches** are detected by a background job scanning open incidents, emitting `incident.sla_breached`.

**Routes:** `POST /v1/incidents`, `GET /v1/incidents`, `PATCH /v1/incidents/{id}` (transition), `POST /v1/incidents/{id}/assign`, `POST /v1/incidents/{id}/escalate`.

---

## 9. New module — Notification Engine (`domains/notifications/`)

- **Channel-agnostic:** in-app (via WS), email, push, SMS behind a provider interface. Dev uses a mock channel (mirrors the reference's MockLLM philosophy — fully offline testable).
- **Event-driven:** subscribes to the event bus; a routing table maps `event_type + recipient-role` → channels + template.
- **Templated + localized** (reuses the phrasing/i18n discipline): EN/ES/FR templates, rendered deterministically.
- **Deduplication + rate-limiting per recipient** so an incident storm doesn't spam operators.

**Routes:** `GET /v1/notifications` (per-user inbox), `POST /v1/notifications/read`, admin `POST /v1/notifications/broadcast`.

---

## 10. New module — AI Service Manager + Gemini Failover (`platform/ai/`)

Replaces the reference's single-key `llm.py`. This is the **highest-value upgrade** and directly ports the pattern PERIMO already built on the frontend (`GeminiServiceManager`).

- **Client pool:** N Gemini keys (`GEMINI_API_KEY`, `GEMINI_API_KEY_2`, …) as a round-robin pool.
- **Health monitor:** per-key state with exponential cooldown on failure; unhealthy keys are skipped until cooled down.
- **Error classifier:** rate-limit / quota / server / network / timeout / auth / invalid-request → drives retry vs. skip vs. fail decisions.
- **Retry queue:** exponential backoff (e.g. 400ms → 8s cap).
- **Failover controller:** round-robin across healthy keys (Primary → Backup → Primary → Backup), then fall back to the **offline template renderer** (the reference's `phrasing.render_answer`) — so the system *never* hard-fails on AI.
- **Unified `execute<T>()` facade** with event emission (`ai.failover`, `ai.degraded`) so Monitoring/WS can surface AI health.
- **Still grounded:** the manager only ever phrases facts a domain service already resolved. Prompt-injection defense (delimited `<user_question>`, sanitized free text, decision-independent-of-question) is retained.

---

## 11. New module — Crowd Intelligence (`domains/crowd/`)

Rewrite of the reference's clock-only `crowd.py` into the **single source of truth** for crowd data.

- **Signal ingestion:** pluggable feeds (sensor/turnstile/camera-count/mock) writing time-series occupancy per zone to Firestore.
- **Fusion model:** live signal (primary) blended with the reference's time-to-kickoff surge simulation (fallback when no live signal). Deterministic and testable.
- **Serves both** `/v1/assist` rerouting *and* the admin Crowd Intelligence dashboard from the same computed levels — resolving the duplication risk flagged in the prior analysis where backend and frontend had two disagreeing crowd models.
- **Emits `crowd.level_changed`** → WS push to `venue:{id}:crowd` room for live dashboards.

**Routes:** `GET /v1/crowd/zones`, `GET /v1/crowd/heatmap`, `POST /v1/crowd/signals` (ingest).

---

## 12. New module — Digital Twin (`domains/digital_twin/`)

- **Aggregation layer:** composes venue geometry (zones/edges/facilities), live crowd, active incidents, and resource positions into one twin snapshot + a live delta stream.
- **Backed by Maps Integration** (§18) for real geospatial rendering on the frontend (which already has `LiveMap`/Google Maps).
- **Delta streaming** over WS (`venue:{id}:twin`) rather than resending full snapshots.

**Routes:** `GET /v1/twin/{venue}/snapshot`, WS room `venue:{id}:twin`.

---

## 13. New module — Transportation (`domains/transportation/`)

- **Entities:** routes, stops, shuttles/services, schedules, live vehicle positions.
- **Rules-first ETA/capacity** computation; AI only for natural-language rider guidance.
- **Weather-aware** (consumes Weather Integration for delay/risk flags).

**Routes:** `GET /v1/transport/routes`, `GET /v1/transport/eta`, `POST /v1/transport/vehicles/{id}/position`.

---

## 14. New module — Resource Deployment (`domains/resources/`)

- **Entities:** deployable units (medical, security, cleaning, stewards) with status/location/assignment.
- **Deterministic dispatch recommendations** (nearest available qualified unit to an incident zone using the routing graph) — AI only to phrase the dispatch brief.
- **Tightly coupled to Incident Engine via events** (`incident.assigned` ↔ `resource.dispatched`).

**Routes:** `GET /v1/resources`, `POST /v1/resources/{id}/assign`, `GET /v1/resources/recommendations`.

---

## 15. New module — Audit Logs (`domains/audit/`)

- **Append-only** collection; every state-changing event bus message is persisted with actor, venue, before/after, correlation ID.
- **Immutable by design** (no update/delete routes); retention handled by a background job.
- **Queryable** for the frontend Audit Logs page with filters + pagination.

**Routes:** `GET /v1/audit` (RBAC: `audit:read` only).

---

## 16. New module — Analytics (`domains/analytics/`)

- **Rollup subscriber** on the event bus maintains pre-aggregated counters/time-series (incidents by type/hour, crowd peaks, response times, transport load) — no expensive on-read scans.
- **Read models** are purpose-built per dashboard widget.
- **Background job** compacts raw events into daily/weekly aggregates.

**Routes:** `GET /v1/analytics/overview`, `GET /v1/analytics/incidents`, `GET /v1/analytics/crowd`.

---

## 17. New module — Background Jobs (`platform/jobs/` + `jobs/` worker)

- **Separate worker process** (Cloud Run Job / scheduled) — not in the request path.
- **Scheduled jobs:** SLA-breach scanner, audit retention/compaction, analytics rollup, refresh-token cleanup, key-health resets, weather refresh, all-pairs-path recompute on venue change.
- **Triggered jobs:** heavy async work handed off from services via the durable event bus (e.g. bulk notification send).

---

## 18. New module — Monitoring (`core/logging.py` + `platform` hooks)

- **Structured JSON logs** with correlation/request IDs threaded from the router through services to repositories.
- **Health/readiness endpoints:** `GET /health` (liveness, no deps) + `GET /ready` (checks Firestore, Redis, Pub/Sub, AI pool health).
- **Metrics:** request latency, event-bus lag, AI failover counts, WS connection counts, rate-limit rejections → exported for Cloud Monitoring.
- **AI health surfaced** from the AI Service Manager's events.

---

## 19. New module — Firestore Integration (`platform/firestore/`)

Replaces the JSON-fixture singleton with a real datastore.

- **Base repository** with typed serialization (Pydantic ↔ Firestore docs), transaction helpers, and optimistic concurrency.
- **In-process read-through cache** (with Redis for cross-instance) for hot, rarely-changing data (venue graph, roles) — preserving the reference's "load once" efficiency without its "load once *forever*, needs redeploy to change" rigidity.
- **Emulator-first testing** (offline CI, honoring the reference's offline-test philosophy).

### Firestore collections

```
venues/{venueId}
  zones/{zoneId}                 # graph nodes (name i18n, type, level)
  edges/{edgeId}                 # from/to/means/step_free/distance
  facilities/{facilityId}        # type, zone, accessible, name/landmark i18n
  crowd_signals/{signalId}       # time-series occupancy per zone
  crowd_levels/{zoneId}          # current fused level (single source of truth)

users/{userId}                   # profile, status
  sessions/{sessionId}           # device/refresh-token registry
roles/{roleId}                   # name, permissions[]
permissions/{permId}             # verb:resource
user_roles/{id}                  # userId, roleId, venueScope

incidents/{incidentId}           # state, severity, zone, assignee, SLA timers
  transitions/{transitionId}     # append-only lifecycle history
resources/{resourceId}           # unit type, status, location, assignment
transport_routes/{routeId}
transport_vehicles/{vehicleId}   # live position, capacity

notifications/{notificationId}   # recipient, channel, status, template
audit_logs/{logId}               # append-only, immutable
analytics_rollups/{bucketId}     # pre-aggregated read models
events_outbox/{eventId}          # durable event dispatch (outbox pattern)
```

**Multi-tenancy:** venue-scoped data is nested under `venues/{venueId}` (or carries a `venueId` field + composite index), so one deployment serves many venues — the reference's hardest ceiling, removed.

---

## 20. New module — Maps & Weather Integration (`platform/maps/`, `platform/weather/`)

- **Maps:** server-side adapter for geocoding/route geometry feeding the Digital Twin; the frontend already renders Google Maps, so the backend supplies coordinates/geometry, not tiles.
- **Weather:** provider adapter with caching (refreshed by a background job, not per-request), feeding Transportation risk flags and operational alerts. Both degrade gracefully (stale-cache or feature-off) — never block a request.

---

## 21. API route map (v1)

```
Auth      POST /v1/auth/{login,refresh,logout,mfa/verify,password/forgot,password/reset}
RBAC      GET|POST /v1/roles · /v1/permissions · POST /v1/users/{id}/roles
Users     GET|POST|PATCH /v1/users
Venues    GET|POST /v1/venues · /v1/venues/{id}/{zones,edges,facilities}
Wayfind   POST /v1/assist            # the reference's endpoint, now venue-scoped + RBAC-aware
          GET  /v1/venues/{id}/metadata
Crowd     GET /v1/crowd/{zones,heatmap} · POST /v1/crowd/signals
Incidents POST /v1/incidents · GET /v1/incidents · PATCH /v1/incidents/{id}
          POST /v1/incidents/{id}/{assign,escalate}
Resources GET /v1/resources · POST /v1/resources/{id}/assign · GET /v1/resources/recommendations
Transport GET /v1/transport/{routes,eta} · POST /v1/transport/vehicles/{id}/position
Twin      GET /v1/twin/{venue}/snapshot
Notify    GET /v1/notifications · POST /v1/notifications/{read,broadcast}
Analytics GET /v1/analytics/{overview,incidents,crowd}
Audit     GET /v1/audit
System    GET /health · GET /ready · GET /metrics
WS        GET /v1/ws                 # authenticated upgrade → rooms
```

---

## 22. WebSocket events

```
Client → Server:  subscribe {rooms:[...]}, unsubscribe {rooms:[...]}, ping
Server → Client (per room):
  incident.reported | incident.updated | incident.escalated | incident.sla_breached
  crowd.level_changed | crowd.heatmap_updated
  resource.dispatched | resource.status_changed
  transport.vehicle_moved | transport.delay
  twin.delta
  notification.new
  ai.degraded | system.alert
```

All server→client events are **projections of domain events** produced by the event bus — the WS layer never originates business events.

---

## 23. Module dependency graph

```
routers/v1  ─────────────▶ domains/*
domains/*   ─────────────▶ security/{auth,rbac}, platform/{firestore,eventbus,ai,cache}
platform/websocket ◀────── eventbus            (WS is an event-bus subscriber)
platform/jobs      ◀────── eventbus + scheduler
domains/audit      ◀────── eventbus            (subscriber, append-only)
domains/notifications ◀─── eventbus            (subscriber)
domains/analytics  ◀────── eventbus            (subscriber)
core        ◀───────────── everything          (leaf; depends on nothing)
```

Domains never import each other directly — they communicate **only through the event bus**. This is the decoupling the reference didn't need (one domain) and V2 can't live without (fifteen).

---

## 24. Sequence diagrams

### 24.1 Fan assist (the reference's flow, upgraded)

```
Client → Router(/v1/assist): UserContext (venue-scoped)
Router → RBAC: allow? (public or fan-scoped) ─ ok
Router → WayfindingService.assist(ctx)
  Service → VenueRepo(Firestore): load graph (cache hit)
  Service → RoutingEngine: step-free Dijkstra           [deterministic]
  Service → CrowdService: effective level (live+sim)    [deterministic]
  Service → (rules): facility, urgency, crowd-swap      [deterministic]  ← DECISION DONE
  Service → AIServiceManager.execute(phrase, facts, question?)
      Manager → healthy Gemini key (failover) OR offline template
  Service → EventBus.publish(assist.served)              [async: analytics/audit]
Router ← AssistResponse (grounded)
```

### 24.2 Incident lifecycle (new)

```
Client → Router(POST /v1/incidents) → RBAC(incident:create) ok
IncidentService.create():
   → deterministic severity + SLA timers            [rules-first]
   → Repo.save(incident) + Repo.append(transition)  [Firestore tx]
   → EventBus.publish(incident.reported)
        ├▶ Notifications: alert on-duty (role-routed, localized)
        ├▶ WebSocket: broadcast to venue:{id}:incidents
        ├▶ Audit: append immutable log
        ├▶ Analytics: increment rollups
        └▶ Resources: compute dispatch recommendation
Later: JobsWorker scans open incidents → publish incident.sla_breached → (same fan-out)
```

### 24.3 AI failover (new)

```
Service → AIServiceManager.execute(prompt)
   → pick healthy key (round-robin)
   → Gemini call → 429 rate_limit
   → classifier: retryable → HealthMonitor.recordFailure(keyA, cooldown)
   → failover to keyB → success
   (if all keys unhealthy) → offline template renderer (never fail)
   → EventBus.publish(ai.failover / ai.degraded) → Monitoring + WS
```

---

## 25. End-to-end data flow

```
Ingress (HTTP/WS) → Router (validate + authZ) → Service (rules-first decision)
   → Repository (Firestore, cached) for facts
   → AI Service Manager (phrasing only, failover-protected)
   → Response
        ╲
         ╲→ Event Bus (state changes) ──┬─▶ WebSocket rooms (live UI)
                                         ├─▶ Notifications (multi-channel)
                                         ├─▶ Audit (append-only)
                                         ├─▶ Analytics (rollups)
                                         └─▶ Jobs (durable/heavy async)
```

Reads are cache-first and deterministic; writes fan out through the event bus so every cross-cutting concern (notify/audit/broadcast/analyze) is automatic and consistent.

---

## 26. Future scalability

- **Stateless request handlers** + externalized state (Firestore + Redis) → scale horizontally to N instances with no per-instance correctness gaps. The reference's two scale-blockers (per-process rate limiter, per-process fixture cache that fragments quota and can't be edited without redeploy) are both eliminated: rate-limit and hot-cache move to Redis; venue data moves to Firestore.
- **Multi-tenant from day one** (`venues/{id}` scoping) → many venues/events per deployment, the reference's single-venue ceiling removed.
- **Event-driven core** → new features attach as event subscribers without touching existing domains; cross-service/eventual work moves to Pub/Sub + the jobs worker.
- **Read/write separation via analytics rollups** → dashboards scale on pre-aggregated read models instead of live scans.
- **AI resilience** → multi-key failover + offline fallback means AI provider limits/outages degrade prose quality only, never availability.
- **Routing at scale** → per-venue all-pairs path cache (recomputed by a job on graph change) keeps `/assist` O(1) on lookups even for large graphs, versus the reference's per-request re-Dijkstra.

---

## 27. Why V2 is architecturally superior to the reference

| Dimension | Reference (StadiumMate) | PERIMO Backend V2 |
|---|---|---|
| Scope | Single fan-wayfinding form | Full multi-domain operations platform |
| Tenancy | One venue per deployment | Multi-venue, multi-event |
| Persistence | In-memory JSON fixtures (redeploy to edit) | Firestore (live-editable) + Redis cache |
| Identity | None (anonymous) | Auth + MFA + sessions |
| Authorization | None | Fine-grained, venue-scoped RBAC (deny-by-default) |
| Real-time | None (request/response) | WebSocket gateway + internal event bus |
| Coupling | N/A (one module) | Event-driven, zero direct cross-domain imports |
| AI resilience | Single key, silent unmonitored fallback | Multi-key failover, health-monitored, offline fallback, observable |
| Crowd data | Clock simulation only, duplicated by frontend | Live-signal fusion, single source of truth |
| Incidents / notifications / audit / analytics | Absent | First-class, auto-wired via event bus |
| Rate limiting | Per-process (fragments at scale) | Redis-backed, correct across instances |
| Observability | Privacy-safe log lines only | Structured logs, correlation IDs, metrics, readiness checks |
| Scaling | Single process assumed | Stateless + externalized state → horizontal |
| **Preserved from reference** | — | **Rules-before-LLM grounding, strict typed contracts, offline-first testing, graceful AI degradation, privacy-safe logging** |

**The essence:** V2 keeps the reference's *intellectual core* — deterministic decisions grounded before any model speaks, wrapped in strict contracts and offline-testable — and rebuilds the *systems around it* (identity, persistence, real time, decoupling, resilience, observability, multi-tenancy) that a demo kernel was never meant to have. It is not a copy of the reference; it is what the reference's best idea looks like once it grows into a production platform.

---

*This document is architecture only. No implementation code is included or implied as delivered; it is the design contract for building PERIMO Backend V2.*
