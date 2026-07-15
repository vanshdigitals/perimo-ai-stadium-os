# PERIMO — Engineering Compatibility Audit

**Author role:** Principal Software Architect / Senior Full-Stack Engineer
**Audit type:** Backend ↔ Frontend compatibility (no code, no UI redesign, no architecture change)
**Frontend status in this audit:** source of truth for UX; not redesigned.
**Method:** direct static analysis of `PERIMO/backend/src/` and `PERIMO/frontend/src/`, cross-referenced against [`BACKEND_V2_ARCHITECTURE.md`](./BACKEND_V2_ARCHITECTURE.md) and [`BACKEND_FRONTEND_INTEGRATION_PLAN.md`](./BACKEND_FRONTEND_INTEGRATION_PLAN.md).

---

## 0. Executive summary — the one finding that governs every score

There are **three different "backends"** in this project, and conflating them would make this audit useless. This report scores the **as-built** reality and measures the gap to the **as-designed** target.

| Layer | What it actually is | Evidence |
|---|---|---|
| **As-built backend** | The reference **StadiumMate** — a 3-route FastAPI fan-wayfinding service. **No** auth, **no** Firestore, **no** WebSocket, **no** incident/notification/RBAC/analytics modules. | `backend/src/main.py` exposes exactly `GET /health`, `GET /api/stadium`, `POST /api/assist`. Grep for `firestore\|firebase\|websocket\|redis` across `backend/` → **0 files**. |
| **As-designed backend (V2)** | The 19-module enterprise platform (RBAC, WS gateway, event bus, incident engine, etc.). | `BACKEND_V2_ARCHITECTURE.md` — a **design document**, not code. None of it is implemented. |
| **As-built frontend** | **18 fully-built admin pages** + auth flows, all rendering **hardcoded mock data**, plus a real client-side Gemini failover manager. | `router/index.tsx` (18 protected routes); e.g. `IncidentCenter.tsx` ships a hardcoded `const INCIDENTS: Incident[]`. Client auth is `sessionStorage` (`authService.ts`). |

**The compatibility reality:** the as-built frontend is an **enterprise operations console**; the as-built backend is a **single-venue fan-wayfinding demo**. They share **almost no surface**. The `/api/assist` + `/api/stadium` endpoints have **no frontend consumer** in the admin UI, and **17 of 18 frontend pages have no backend at all**. This is not a defect to be alarmed by — it is the expected state of a project where the frontend was built ahead of a backend whose V2 design already exists on paper. The audit below quantifies that gap and prioritizes closing it.

**Bottom line:** frontend is production-grade and ready; backend-as-built serves none of it; the V2 design is sound and, once built, closes the gap. Scores reflect *as-built* unless a cell explicitly notes the V2 target.

---

## 1. Backend surface — as built

| Endpoint | Method | Purpose | Frontend consumer? |
|---|---|---|---|
| `/health` | GET | Liveness | None (no monitoring page wired) |
| `/api/stadium` | GET | Zone/facility/enum metadata | **None** (no admin consumer; Digital Twin uses mock geometry) |
| `/api/assist` | POST | Grounded wayfinding answer | **None** (no admin or fan surface calls it) |

- **Auth:** none. **RBAC:** none. **Persistence:** in-memory JSON fixtures (`app/data/*.json` equivalent under `backend/`). **Real-time:** none. **AI:** single-key Mock/Gemini, no failover (`utils/llm.py`).
- **Naming note:** data-access logic lives at `src/api/controllers/{crowd,stadium_data}.py` but contains **no controllers** — `crowd.py` is a pure simulation function, `stadium_data.py` is a repository. This is a **naming inconsistency** carried from the refactor (see §6).

## 2. Frontend surface — as built

18 protected admin routes, each a complete page built from the shared widget kit (`components/widgets/*`), all fed by **mock data**:

`/admin` (Dashboard), `/admin/live-ops`, `/admin/crowd`, `/admin/digital-twin`, `/admin/incidents`, `/admin/transportation`, `/admin/facilities`, `/admin/security`, `/admin/ai`, `/admin/analytics`, `/admin/users`, `/admin/roles`, `/admin/notifications`, `/admin/audit-logs`, `/admin/settings`, `/admin/help`, `/admin/docs`, `/admin/support`, plus public + auth routes.

- **Data layer:** none. No API client, no fetch/query library — every page holds mock arrays inline or in `features/*/services/Mock*.ts`.
- **AI:** real `GeminiServiceManager` (multi-key failover) runs **client-side** — a security concern for production (keys in browser).
- **Auth:** `sessionStorage`-based dev layer (`authService.ts`), interface-shaped to swap for a real backend.

---

## 3. Per-page compatibility tables

Legend for **Current Compatibility**: ✅ Fully Compatible · 🟡 Minor Changes · 🟠 Backend Missing · 🔴 Frontend Missing.
"Required Backend Module / APIs / Collections / WS" = what the page *needs* per V2 design; "Missing Backend Features" = gap vs. **as-built**.

### 3.1 `/admin` — Command Center Dashboard

| Field | Detail |
|---|---|
| **Route** | `/admin` |
| **Components** | `AdminDashboard`, `PlatformHealthStrip`, `LiveOperationsSummary`, `CriticalAlertsWidget`, `CrowdGatesWidget`, `ResourceDeploymentWidget`, `SystemHealthWidget`, `TelemetryBar`, `DigitalTwinWidget`, `AIOperationsWidget`, `KPICard` |
| **Required Backend Module** | Aggregation across Crowd, Incidents, Resources, Monitoring, AI, Digital Twin |
| **Required REST APIs** | `/v1/analytics/overview`, `/v1/crowd/zones`, `/v1/incidents`, `/v1/resources`, `/ready` |
| **Required Firestore** | `crowd_levels`, `incidents`, `resources`, `analytics_rollups` |
| **Required WS Events** | `crowd.level_changed`, `incident.*`, `resource.*`, `ai.degraded` |
| **Current Compatibility** | 🟠 Backend Missing (frontend complete, no backend for any tile) |
| **Missing Backend Features** | All aggregation endpoints; every module the tiles read |
| **Missing Frontend Features** | None (page complete) |
| **Suggested Improvements** | Introduce a single dashboard-aggregation endpoint to avoid 5 parallel calls on first paint |
| **Integration Difficulty** | High (touches many modules) |
| **Priority** | P1 |

### 3.2 `/admin/incidents` — Incident Center

| Field | Detail |
|---|---|
| **Route** | `/admin/incidents` |
| **Components** | `IncidentCenter`, `DataTable`, `Timeline`, `StatusPill`, `FilterBar`, `AIInsightsPanel`, `KPICard`, `DonutChart` |
| **Required Backend Module** | Incident Engine |
| **Required REST APIs** | `GET/POST /v1/incidents`, `PATCH /v1/incidents/{id}`, `POST /v1/incidents/{id}/{assign,escalate}` |
| **Required Firestore** | `incidents`, `incidents/{id}/transitions` |
| **Required WS Events** | `incident.reported|updated|escalated|sla_breached` |
| **Current Compatibility** | 🟠 Backend Missing (hardcoded `INCIDENTS` array) |
| **Missing Backend Features** | Entire Incident Engine (state machine, SLA, assignment) |
| **Missing Frontend Features** | None; `Timeline` already models lifecycle history |
| **Suggested Improvements** | Add a create-incident action (page is read-only today) |
| **Integration Difficulty** | High |
| **Priority** | P1 |

### 3.3 `/admin/crowd` — Crowd Intelligence

| Field | Detail |
|---|---|
| **Route** | `/admin/crowd` |
| **Components** | `CrowdIntelligence`, `CrowdIntelligenceWidget`, `CrowdGatesWidget`, `EntryGatesWidget`, `KPICard`, `AreaLineChart`, `DonutChart`, `BarChart` |
| **Required Backend Module** | Crowd Intelligence |
| **Required REST APIs** | `GET /v1/crowd/zones`, `GET /v1/crowd/heatmap` |
| **Required Firestore** | `crowd_levels`, `crowd_signals` |
| **Required WS Events** | `crowd.level_changed`, `crowd.heatmap_updated` |
| **Current Compatibility** | 🟠 Backend Missing — **but a partial capability exists**: as-built `effective_crowd()` computes zone crowd |
| **Missing Backend Features** | Live-signal ingestion; zones/heatmap endpoints; the fusion model. **Duplication risk:** backend `effective_crowd` vs. frontend mock crowd (see §7) |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Expose `effective_crowd` via `/v1/crowd/zones` as the single source of truth |
| **Integration Difficulty** | Medium |
| **Priority** | P1 |

### 3.4 `/admin/digital-twin` — Digital Twin

| Field | Detail |
|---|---|
| **Route** | `/admin/digital-twin` |
| **Components** | `DigitalTwinOverview`, `LiveMap`, `DigitalTwinWidget`, `useGoogleMaps`, `useLiveUpdates`, `WebSocketClient`, `MockSimulator` |
| **Required Backend Module** | Digital Twin + Venues + Maps |
| **Required REST APIs** | `GET /v1/twin/{venue}/snapshot`, `GET /v1/venues/{id}/metadata` |
| **Required Firestore** | `venues/{v}/{zones,edges,facilities}`, `resources`, `incidents` |
| **Required WS Events** | `twin.delta` |
| **Current Compatibility** | 🟠 Backend Missing (a `WebSocketClient` exists client-side but points at nothing; `MockSimulator` drives it) |
| **Missing Backend Features** | Twin snapshot/delta; venue geometry endpoint; the WS gateway the client expects |
| **Missing Frontend Features** | None (strongest-built module; Google Maps live) |
| **Suggested Improvements** | Note: as-built `/api/stadium` already returns zone/facility geometry — could feed venue metadata with light adaptation |
| **Integration Difficulty** | Medium-High |
| **Priority** | P2 |

### 3.5 `/admin/transportation` — Transportation

| Field | Detail |
|---|---|
| **Route** | `/admin/transportation` |
| **Components** | `Transportation`, `DataTable`, `KPICard`, `AreaLineChart`, `StatusPill` |
| **Required Backend Module** | Transportation + Weather |
| **Required REST APIs** | `GET /v1/transport/routes`, `GET /v1/transport/eta` |
| **Required Firestore** | `transport_routes`, `transport_vehicles` |
| **Required WS Events** | `transport.vehicle_moved`, `transport.delay` |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | Entire Transportation + Weather modules |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Surface weather-derived delay flags via existing `StatusPill` |
| **Integration Difficulty** | Medium |
| **Priority** | P2 |

### 3.6 `/admin/analytics` — Analytics

| Field | Detail |
|---|---|
| **Route** | `/admin/analytics` |
| **Components** | `Analytics`, `KPICard`, `BarChart`, `AreaLineChart`, `DonutChart` |
| **Required Backend Module** | Analytics |
| **Required REST APIs** | `GET /v1/analytics/{overview,incidents,crowd}` |
| **Required Firestore** | `analytics_rollups` |
| **Required WS Events** | None |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | Rollup subscriber + read models |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Date-range filter should drive server query, not client slicing |
| **Integration Difficulty** | Medium |
| **Priority** | P2 |

### 3.7 `/admin/notifications` + `NotificationBell` — Notifications

| Field | Detail |
|---|---|
| **Route** | `/admin/notifications` |
| **Components** | `Notifications`, `NotificationBell`, `DataTable`, `StatusPill` |
| **Required Backend Module** | Notification Engine + Event Bus |
| **Required REST APIs** | `GET /v1/notifications`, `POST /v1/notifications/{read,broadcast}` |
| **Required Firestore** | `notifications` |
| **Required WS Events** | `notification.new` |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | Entire engine + event-bus triggers |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Bell badge should reflect unread count from server |
| **Integration Difficulty** | Medium |
| **Priority** | P2 |

### 3.8 `/admin/audit-logs` — Audit Logs

| Field | Detail |
|---|---|
| **Route** | `/admin/audit-logs` |
| **Components** | `AuditLogs`, `DataTable`, `FilterBar`, `StatusPill` |
| **Required Backend Module** | Audit + Event Bus |
| **Required REST APIs** | `GET /v1/audit` |
| **Required Firestore** | `audit_logs` (append-only) |
| **Required WS Events** | None |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | Append-only audit collection + event subscriber |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Gate route behind `audit:read` once RBAC exists |
| **Integration Difficulty** | Low-Medium |
| **Priority** | P2 |

### 3.9 `/admin/users` — User Management

| Field | Detail |
|---|---|
| **Route** | `/admin/users` |
| **Components** | `UserManagement`, `DataTable`, `StatusPill`, `FilterBar` |
| **Required Backend Module** | Users + RBAC |
| **Required REST APIs** | `GET/POST/PATCH /v1/users`, `POST /v1/users/{id}/roles` |
| **Required Firestore** | `users`, `user_roles` |
| **Required WS Events** | None |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | User CRUD + role assignment |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Tie into auth user store to avoid a second user model |
| **Integration Difficulty** | Medium |
| **Priority** | P2 |

### 3.10 `/admin/roles` — Roles & Permissions

| Field | Detail |
|---|---|
| **Route** | `/admin/roles` |
| **Components** | `RolesPermissions`, `DataTable`, `StatusPill` |
| **Required Backend Module** | RBAC |
| **Required REST APIs** | `GET/POST /v1/roles`, `GET/POST /v1/permissions` |
| **Required Firestore** | `roles`, `permissions`, `user_roles` |
| **Required WS Events** | `system.alert` (role change → refresh) |
| **Current Compatibility** | 🟠 Backend Missing + 🔴 enforcement gap (no client-side gating exists) |
| **Missing Backend Features** | Entire RBAC model + policy engine |
| **Missing Frontend Features** | `usePermissions` hook + `<Can>` gate (additive, not a redesign) |
| **Suggested Improvements** | Deny-by-default gating of nav + destructive actions |
| **Integration Difficulty** | Medium-High |
| **Priority** | P1 (security-bearing) |

### 3.11 `/admin/security` — Security Center

| Field | Detail |
|---|---|
| **Route** | `/admin/security` |
| **Components** | `SecurityCenter`, `DataTable`, `StatusPill`, `Timeline`, `KPICard` |
| **Required Backend Module** | Auth (security events) + Incident (security-type) + Audit |
| **Required REST APIs** | `GET /v1/audit` (security-filtered), incident feeds |
| **Required Firestore** | `audit_logs`, `incidents`, `users/{id}/sessions` |
| **Required WS Events** | `system.alert`, `incident.*` |
| **Current Compatibility** | 🟠 Backend Missing (partial: `authService.getSecurityLog()` exists client-side in sessionStorage) |
| **Missing Backend Features** | Server-side security event stream |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Consolidate the client security-log concept into server audit |
| **Integration Difficulty** | Medium |
| **Priority** | P2 |

### 3.12 `/admin/live-ops` — Live Operations

| Field | Detail |
|---|---|
| **Route** | `/admin/live-ops` |
| **Components** | `LiveOperations`, `KPICard`, `DataTable`, charts, `StatusStrip` |
| **Required Backend Module** | Crowd + Incidents + Resources + Weather (composite) |
| **Required REST APIs** | composite of `/v1/crowd`, `/v1/incidents`, `/v1/resources` |
| **Required Firestore** | `crowd_levels`, `incidents`, `resources` |
| **Required WS Events** | `crowd.*`, `incident.*`, `resource.*` |
| **Current Compatibility** | 🟠 Backend Missing |
| **Missing Backend Features** | All composite sources |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Embed compact weather/ops-conditions strip |
| **Integration Difficulty** | High (composite) |
| **Priority** | P2 |

### 3.13 `/admin/facilities` — Facilities

| Field | Detail |
|---|---|
| **Route** | `/admin/facilities` |
| **Components** | `Facilities`, `DataTable`, `StatusPill`, `FilterBar` |
| **Required Backend Module** | Venues registry |
| **Required REST APIs** | `GET /v1/venues/{id}/facilities` |
| **Required Firestore** | `venues/{v}/facilities` |
| **Required WS Events** | None |
| **Current Compatibility** | 🟡 Minor — as-built `/api/stadium` **already returns facilities**; only shape adaptation needed |
| **Missing Backend Features** | Multi-venue scoping; write/CRUD (as-built is read-only fixtures) |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | This is the **single closest** frontend↔as-built-backend match — integrate first as a proof of seam |
| **Integration Difficulty** | Low |
| **Priority** | P1 (quick win) |

### 3.14 `/admin/ai` — AI Center

| Field | Detail |
|---|---|
| **Route** | `/admin/ai` |
| **Components** | `AICenter`, `AIOperationsWidget`, `RecommendationCard`, `AIInsightsPanel`, `useGeminiStatus`, `GeminiServiceManager` (client) |
| **Required Backend Module** | AI Service Manager (server) + Gemini Failover |
| **Required REST APIs** | AI-backed domain endpoints; `/ready` (AI pool health) |
| **Required Firestore** | none (keys via Secret Manager) |
| **Required WS Events** | `ai.degraded` |
| **Current Compatibility** | 🟡 Minor / partial — **failover logic already built**, but **client-side** (keys in browser = security risk) |
| **Missing Backend Features** | Server-side AI manager; as-built `utils/llm.py` is single-key, no failover |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Move AI calls server-side; re-point `GeminiRecommendationService`; keep widget UI |
| **Integration Difficulty** | Medium |
| **Priority** | P1 (security-bearing) |

### 3.15 `/admin/settings` — Platform Settings

| Field | Detail |
|---|---|
| **Route** | `/admin/settings` |
| **Components** | `PlatformSettings`, form controls, `StatusPill` |
| **Required Backend Module** | Config / Settings API |
| **Required REST APIs** | `GET/PATCH /v1/settings` (not in V2 route map — **gap**) |
| **Required Firestore** | `settings` (not defined in V2 collections — **gap**) |
| **Required WS Events** | None |
| **Current Compatibility** | 🟠 Backend Missing + architecture gap (no settings endpoint/collection designed) |
| **Missing Backend Features** | A settings read/write surface (V2 has `Settings` object but no admin CRUD route) |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Add `settings` collection + `/v1/settings` to V2 (flagged, not designed here) |
| **Integration Difficulty** | Medium |
| **Priority** | P3 |

### 3.16 `/admin/help`, `/admin/docs`, `/admin/support` — Support trio

| Field | Detail |
|---|---|
| **Routes** | `/admin/help`, `/admin/docs`, `/admin/support` |
| **Components** | `HelpCenter`, `Documentation`, `Support` |
| **Required Backend Module** | None (static/content) or a lightweight Support-ticket module (undesigned) |
| **Required REST APIs** | Optional `POST /v1/support/tickets` (not in V2) |
| **Required Firestore** | Optional `support_tickets` (not in V2) |
| **Required WS Events** | None |
| **Current Compatibility** | ✅ Fully Compatible as static content (no backend needed) |
| **Missing Backend Features** | Only if Support becomes ticketed (undesigned) |
| **Missing Frontend Features** | None |
| **Suggested Improvements** | Keep static unless ticketing is required |
| **Integration Difficulty** | Low / N/A |
| **Priority** | P4 |

### 3.17 Auth routes (`/auth/**`) — Authentication

| Field | Detail |
|---|---|
| **Routes** | `/auth/fan/*`, `/auth/volunteer/login`, `/auth/staff/login`, `/auth/admin/*` (login, mfa, forgot, reset, verify) |
| **Components** | `FanAuth`, `StaffAuth`, `VolunteerAuth`, `AdminLogin`, `AdminMFA`, reset flows, `ProtectedRoute`, `authService` |
| **Required Backend Module** | Authentication |
| **Required REST APIs** | `POST /v1/auth/{login,refresh,logout,mfa/verify,password/forgot,password/reset}` |
| **Required Firestore** | `users`, `users/{id}/sessions` |
| **Required WS Events** | Optional session-revocation `system.alert` |
| **Current Compatibility** | 🟠 Backend Missing (client is `sessionStorage` dev layer; **no server auth exists**) |
| **Missing Backend Features** | Entire auth module (tokens, MFA, password reset, sessions) |
| **Missing Frontend Features** | None (flows complete, interface-shaped to swap) |
| **Suggested Improvements** | Swap `authService` bodies per its own docstring; add token refresh in API client |
| **Integration Difficulty** | Medium-High |
| **Priority** | **P0** (nothing else is securable without it) |

### 3.18 Wayfinding `/api/assist` — the orphaned backend capability

| Field | Detail |
|---|---|
| **Route** | *(none — no frontend consumer)* |
| **Components** | *(none)* |
| **Backend Module** | Wayfinding (as-built, working) |
| **REST APIs** | `POST /api/assist`, `GET /api/stadium` (both live) |
| **Firestore** | n/a (JSON fixtures) |
| **WS Events** | None |
| **Current Compatibility** | 🔴 **Frontend Missing** — the only fully-working backend capability has **zero UI consumer** |
| **Missing Backend Features** | None (works) |
| **Missing Frontend Features** | No admin/fan surface calls it. Optional diagnostic panel in AI Center |
| **Suggested Improvements** | Either surface it (operator "test assist" panel) or accept it as a fan-only future feature |
| **Integration Difficulty** | Low (if surfaced) |
| **Priority** | P4 |

---

## 4. Engineering Compatibility Matrix

| Page / Surface | Frontend | Backend (as-built) | Status |
|---|---|---|---|
| `/admin/facilities` | ✅ complete | 🟡 `/api/stadium` returns facilities | 🟡 **Compatible with minor changes** |
| `/admin/ai` (AI Center) | ✅ complete (failover built) | 🟡 single-key, client-side | 🟡 **Compatible with minor changes** |
| `/admin/help` · `/docs` · `/support` | ✅ complete | N/A (static) | ✅ **Fully compatible** |
| `/admin` Dashboard | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/incidents` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/crowd` | ✅ complete | 🟠 partial (`effective_crowd`) | 🟠 **Backend missing** |
| `/admin/digital-twin` | ✅ complete | 🟠 none (geometry adaptable) | 🟠 **Backend missing** |
| `/admin/transportation` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/analytics` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/notifications` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/audit-logs` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/users` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/roles` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/security` | ✅ complete | 🟠 partial (client log) | 🟠 **Backend missing** |
| `/admin/live-ops` | ✅ complete | 🟠 none | 🟠 **Backend missing** |
| `/admin/settings` | ✅ complete | 🟠 none + undesigned | 🟠 **Backend missing** |
| Auth `/auth/**` | ✅ complete | 🟠 none (dev layer only) | 🟠 **Backend missing** |
| RBAC enforcement | 🔴 gating hook absent | 🟠 none | 🔴 **Frontend missing** (+backend) |
| `/api/assist` capability | 🔴 no consumer | ✅ works | 🔴 **Frontend missing** |

**Counts:** ✅ 1 · 🟡 2 · 🟠 14 · 🔴 2 (RBAC gating, orphaned assist).

**Interpretation:** the frontend is uniformly ✅-complete per page; the gap is almost entirely **backend-missing** because the as-built backend implements one page's worth of capability (facilities/assist) out of eighteen. Only two true frontend gaps exist, and both are small and additive (an RBAC gating hook; an optional assist consumer).

---

## 5. Readiness scores

Scored against **as-built** reality, with method shown. Scores are deliberately conservative — they measure shippable-today, not design intent.

### 5.1 Backend Readiness — **22 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Endpoint coverage vs. frontend need | 40 | 4 | 3 endpoints serve ~1 of 18 pages |
| Auth / RBAC | 15 | 0 | None built |
| Persistence (Firestore) | 15 | 0 | JSON fixtures only |
| Real-time (WS/event bus) | 10 | 0 | None built |
| AI resilience (server) | 10 | 3 | Single-key, graceful fallback, no failover |
| Code quality of what exists | 10 | 9 | The wayfinding kernel is clean, typed, tested |
| **Total** | 100 | **22** | Strong kernel, near-zero platform surface |

### 5.2 Frontend Readiness — **88 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Page/feature completeness | 30 | 29 | 18 pages, full widget kit, no placeholders |
| Design-system consistency | 20 | 19 | Uniform kit, states handled |
| Component reuse / architecture | 15 | 14 | Shared widgets, lazy routes |
| Data-layer readiness (API seam) | 20 | 6 | **No API client / query layer** — biggest gap |
| Auth interface readiness | 10 | 9 | Swap-shaped `authService` |
| AI integration | 5 | 4 | Failover built, but client-side (see security) |
| **Total** | 100 | **88** | Production-grade UI; missing only the data seam |

### 5.3 Integration Readiness — **18 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Endpoints with a live consumer | 25 | 2 | assist/stadium have none; facilities is adaptable |
| Frontend pages with a live backend | 25 | 2 | ~1 of 18 |
| Shared data-access seam exists | 20 | 0 | Not built |
| WS wiring | 15 | 1 | Client `WebSocketClient` points at nothing |
| Contract alignment (naming/shape) | 15 | 4 | assist shape ≠ any admin page; enums differ |
| **Total** | 100 | **18** | Two systems built past each other; V2 design bridges them |

### 5.4 Architecture Quality — **74 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| V2 design soundness | 30 | 27 | Event-driven, layered, multi-tenant — strong |
| As-built backend design | 20 | 16 | Clean rules-first kernel; good separation |
| Frontend architecture | 20 | 17 | Feature-sliced, shared kit, lazy loading |
| Naming/structure consistency | 15 | 7 | `api/controllers/` holds non-controllers (§6) |
| Design ↔ build alignment | 15 | 7 | Large gap between V2 docs and built code |
| **Total** | 100 | **74** | Excellent designs; consistency + build-alignment drag it down |

### 5.5 Security Readiness — **31 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| AuthN (server) | 25 | 2 | Client `sessionStorage` only; no server auth |
| AuthZ / RBAC | 20 | 0 | None; no gating client or server |
| Secret handling | 15 | 3 | **Gemini failover runs in browser → keys exposed** |
| Input validation | 15 | 13 | Backend Pydantic is excellent (`extra="forbid"`, zone validator) |
| Transport/headers | 10 | 7 | Backend sets CSP/nosniff/frame-deny; good |
| Rate limiting | 10 | 6 | Token bucket exists but per-process only |
| Audit trail | 5 | 0 | No server audit |
| **Total** | 100 | **31** | Good validation hygiene; missing every identity/authorization layer |

### 5.6 Score summary

| Score | Value | One-line verdict |
|---|---|---|
| **Backend Readiness** | **22 / 100** | Clean kernel, almost no platform surface |
| **Frontend Readiness** | **88 / 100** | Production-grade; only the data seam is missing |
| **Integration Readiness** | **18 / 100** | The two halves were built past each other |
| **Architecture Quality** | **74 / 100** | Strong designs; consistency + build-alignment gaps |
| **Security Readiness** | **31 / 100** | Excellent input validation; no identity/authz layer, keys in browser |

---

## 6. Naming & structural inconsistencies

1. **`api/controllers/` contains no controllers.** `backend/src/api/controllers/crowd.py` is a pure simulation function; `stadium_data.py` is a repository. Recommend the V2 naming (`domains/crowd/service.py`, `platform/firestore/venue_repository.py`). *Cosmetic but misleading.*
2. **Stale docstrings from the copy.** `config/settings.py` still references `app.services.llm.MockLLM` — a module path that doesn't exist in PERIMO's tree. Several backend files carry StadiumMate-era docstrings.
3. **App title mismatch.** `main.py` still titles the FastAPI app `"StadiumMate"` / *"assistant for FIFA World Cup 2026"* — not PERIMO. Every OpenAPI consumer sees the wrong product name.
4. **Enum/domain vocabulary mismatch.** Backend domain nouns (`DestinationIntent`, `AccessibilityMode`, `facility`, `zone`) are fan-wayfinding terms; the frontend's domain nouns (incident, resource, shift, role, notification) don't intersect them at all. No shared contract vocabulary exists yet.
5. **Two crowd models, two shapes.** Backend `CrowdLevel` = `low|medium|high`; frontend crowd widgets use percentage/density mock values. Contracts must be unified (see §7).

---

## 7. Duplicated functionality

1. **Crowd computation ×2.** Backend `effective_crowd()` (real, deterministic) vs. frontend mock crowd data in `CrowdIntelligence`/command-center widgets. **Single source of truth required** — expose the backend value; retire the frontend mock. (Already flagged in the architecture and integration plans.)
2. **AI failover manager ×2 (conceptually).** Client `GeminiServiceManager` (built) vs. V2's server-side AI Service Manager (designed). These must not both call Gemini in production — the client one should become a thin caller of the server, or be demoted to a demo-only path. Keys in the browser is the security driver.
3. **Security event log ×2.** `authService.getSecurityLog()` (client `sessionStorage`) vs. V2 server `audit_logs`. The client log should feed from / be replaced by server audit once it exists.
4. **User identity ×2 (latent).** Auth will own a `users` store; User Management page also implies a user store. Design them as **one** collection to avoid divergence.

---

## 8. Architecture mismatches

1. **Scope mismatch (the headline).** As-built backend = single-venue anonymous fan tool; frontend = multi-module authenticated operations console. The V2 design resolves this, but until built, the mismatch is total.
2. **Statefulness mismatch.** Frontend pages assume persistent, queryable, mutable data (create incident, assign resource, edit user). As-built backend is stateless with immutable fixtures — it cannot service a single write the frontend implies.
3. **Real-time mismatch.** Multiple frontend surfaces are built for live push (`useLiveUpdates`, `WebSocketClient`, `NotificationBell`); as-built backend has no socket at all. Frontend degrades to static, so this is latent, not breaking.
4. **Tenancy mismatch.** Frontend has a `WorkspaceSwitcher` (multi-venue intent); as-built backend is hard single-venue (`get_stadium()` singleton). V2's `venues/{id}` scoping is required to honor the switcher.
5. **AI trust-boundary mismatch.** AI decisioning currently sits in the browser; enterprise posture requires it server-side behind auth.

---

## 9. Verification checklist (objectives 11–23)

| # | Item | Verdict |
|---|---|---|
| 11 | **Firestore collections** | 🔴 **None exist.** Backend uses in-memory JSON fixtures. All 15+ V2 collections are designed-only. |
| 12 | **WebSocket events** | 🔴 **None served.** Client `WebSocketClient` exists but has no server endpoint; all §22 events are designed-only. |
| 13 | **Authentication flow** | 🟠 Frontend flows complete + swap-shaped; **server auth absent** (dev `sessionStorage` only). **P0 gap.** |
| 14 | **RBAC** | 🔴 Absent both sides (page renders roles, but no model server-side and no gating client-side). |
| 15 | **AI integration** | 🟡 Failover built **client-side** (security risk); server AI is single-key no-failover. Move server-side. |
| 16 | **Digital Twin** | 🟡 Frontend strongest-built (live Google Maps); backend twin absent but `/api/stadium` geometry is adaptable. |
| 17 | **Crowd Intelligence** | 🟠 Backend `effective_crowd` real but unexposed; frontend on mock. Unify as single source of truth. |
| 18 | **Incident Management** | 🟠 Frontend complete (table+timeline+AI); **zero backend** (no engine, no persistence). |
| 19 | **Transportation** | 🟠 Frontend complete; zero backend. |
| 20 | **Analytics** | 🟠 Frontend complete; zero backend (no rollups). |
| 21 | **Notifications** | 🟠 Frontend complete (page+bell); zero backend/event-bus. |
| 22 | **Audit Logs** | 🟠 Frontend complete; zero backend (no append-only store). |
| 23 | **User Management** | 🟠 Frontend complete; zero backend (no user CRUD). |

---

## 10. Prioritized recommendations

**P0 — Foundational (nothing ships without these)**
1. Build the **Authentication** module (server) + the frontend **API client/token seam** — every other integration depends on it.
2. **Move AI calls server-side.** Client-side Gemini keys are a production security defect; this is independent of feature work.

**P1 — Highest value / security-bearing**
3. Build **RBAC** (model + policy engine) and add the frontend `usePermissions`/`<Can>` gating hook (additive).
4. Integrate **Facilities** against the existing `/api/stadium` data — the one quick win that proves the whole seam end-to-end.
5. Build **Incident Engine** + expose **Crowd** as single source of truth (retire the duplicate mock).

**P2 — Core operations modules**
6. Notifications + Event Bus, Analytics rollups, Audit, Users, Digital Twin snapshot/delta, Transportation.

**P3–P4 — Polish / optional**
7. Platform Settings endpoint (design gap — add `settings` collection + route to V2 first).
8. Real-time WS layer (after REST works — polling-first per the integration plan).
9. Fix naming/docstring/app-title inconsistencies (§6) — low effort, removes confusion.
10. Decide the fate of the orphaned `/api/assist` (surface as diagnostic, or defer to a fan feature).

---

## 11. Closing assessment

PERIMO is **two well-built halves that have not yet met**: a production-grade enterprise frontend (88/100) and a clean but tiny fan-wayfinding backend (22/100), joined today by essentially nothing (integration 18/100). This is a **normal and recoverable** state for a frontend-led build with a mature backend *design* already on paper. The architecture quality (74/100) is high because the V2 blueprint is sound; the risk is not the design but the **distance between design and build**, and the **security posture** (31/100) that will remain unacceptable until server auth, RBAC, and server-side AI exist.

The critical path is unambiguous: **auth + API seam first, AI off the client second, then RBAC, then module-by-module** — beginning with Facilities as the cheapest end-to-end proof. None of this requires touching the frontend's visual language or altering the V2 architecture; it requires **building** the V2 backend and **wiring** the seam the frontend was already shaped to accept.

---

*Audit only — no code written, no UI redesigned, no architecture modified. Scores reflect as-built state on the audit date and should be re-run after each phase of the integration plan.*
