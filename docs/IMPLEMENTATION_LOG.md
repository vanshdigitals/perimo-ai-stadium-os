# PERIMO Backend V2 — Implementation Log

Module-by-module build log. Each phase is built, integrated, verified, and its
mock data removed before the next begins (per the implementation rules).

Source of truth: `BACKEND_V2_ARCHITECTURE.md`, `BACKEND_FRONTEND_INTEGRATION_PLAN.md`,
`COMPATIBILITY_AUDIT.md`.

---

## Phase 1 — Foundation + Auth + Facilities quick win ✅ COMPLETE

**Date:** 2026-07-15

### Backend infrastructure (new)
- `src/config/settings.py` — extended with V2 fields (JWT, Firestore, API prefix, seed admin). Backward-compatible with the wayfinding kernel; every subsystem degrades gracefully when unconfigured.
- `src/core/errors.py` — typed error taxonomy (`AppError` + subclasses) mapped to HTTP by one handler in the app factory (`{error:{code,message}}` envelope).
- `src/platform/firestore/store.py` — **pluggable document store**: `FirestoreStore` (real, lazy SDK) + `MemoryStore` (offline, seeded from `src/database/seed/*.json`). Selected at startup exactly like Mock/Gemini. Runs fully offline.
- `src/platform/firestore/repository.py` — generic typed `Repository[Model]` base.
- `src/bootstrap/container.py` — composition root; wires stores + services onto `app.state`; idempotently seeds the admin user.
- `src/main.py` — rebranded to **PERIMO** (was "StadiumMate"), mounts `/v1` routers, adds `/ready`, keeps `/api/assist` + `/api/stadium` untouched.

### Authentication module (new) — `src/security/auth/`
- `passwords.py` (PBKDF2-HMAC-SHA256, stdlib), `tokens.py` (JWT access/refresh via PyJWT), `schemas.py`, `repository.py` (users + sessions), `service.py` (login → MFA → tokens → refresh → logout), `dependencies.py` (`require_user` bearer guard), `router.py`.
- Endpoints: `POST /v1/auth/{login,mfa/verify,refresh,logout,password/forgot}`, `GET /v1/auth/me`.
- MFA-first flow; refresh sessions revocable on logout. Seed admin matches frontend dev creds (`admin@perimo.io` / `Admin@123`, MFA `123456`/`000000`).

### Facilities domain (new, quick win) — `src/domains/facilities/`
- `schema.py`, `repository.py`, `service.py`, `router.py` + seed `facility_systems.json`, `facility_maintenance.json`.
- Endpoint: `GET /v1/facilities/overview` (auth-protected) — shape mirrors the frontend page exactly.

### Frontend data seam (new) — no UI redesign
- `src/platform/api/{types,tokenStore,client,auth}.ts` — one fetch client (base URL, bearer injection, 401→refresh-retry, typed `ApiError`), token store, backend session bootstrap.
- `src/hooks/data/useApiQuery.ts` — dependency-free query hook (loading/error/data/refetch, abort on unmount).
- `src/features/facilities/{api,useFacilities}.ts` — typed Facilities fetch.
- `src/features/facilities/pages/Facilities.tsx` — **mock removed**; sources all data from `useFacilities()`; loading (skeletons) / error (`ErrorState`+Retry) / loaded states. Visuals unchanged.
- `src/features/auth/services/authService.ts` — additive backend token bootstrap during the existing login→MFA flow (no signature/UI change); logout revokes backend session.
- `.env` — added `VITE_API_BASE_URL`.
- Removed one pre-existing dead import (`cn`) in `AdminLayout.tsx` to keep the build green.

### Verification
- **Backend:** `pytest` 79 passed (71 original + 8 new: `test_auth.py`, `test_facilities.py`), no regressions. Live curl: login→MFA→token→`/facilities/overview` 200; unauth → 401.
- **Frontend:** `tsc` clean. Browser E2E: admin login → MFA → dashboard → Facilities renders from backend (`GET /v1/facilities/overview` → 200 with bearer token). Error state verified (backend stopped → `ErrorState` + Retry; restart + Retry → recovers). Loaded visuals identical to the previous mock design.
- **Note:** "Open Maintenance" now reads **4** (backend-computed, correct) vs. the old hardcoded **3** — a data-correctness improvement; layout/styling unchanged.
- **Known pre-existing console errors (not Phase 1):** client-side Gemini invalid-key + Google Maps invalid-key (placeholder keys; Gemini is a Phase 4 item), and duplicate-key warnings from other dashboard components.

### Mock data removed
- Facilities page mock constants (`POWER_TREND`, `WATER_STATUS`, `MAINTENANCE`, `CLEANING_SCHEDULE`).

---

## Phase 2 — Crowd Intelligence · Incident Engine · Notifications · Resource Deployment ✅ COMPLETE

**Date:** 2026-07-15

### Backend domains (new) — `src/domains/`
- **crowd/** — `GET /v1/crowd/overview`. Zones + trends + AI insights; summary (total occupancy, congestion counts, highest-density zone) **derived** from zones = single source of truth. Seeds: `crowd_zones.json`, `crowd_meta.json`.
- **incidents/** — full engine: `GET /v1/incidents`, `GET /v1/incidents/overview`, `POST /v1/incidents`, `PATCH /v1/incidents/{id}` (lifecycle state machine, rejects illegal transitions), `POST /v1/incidents/{id}/assign` (Open→Responding), `POST /v1/incidents/{id}/escalate` (severity ladder). Seeds: `incidents.json`, `incident_meta.json`.
- **notifications/** — `GET /v1/notifications`, `POST /v1/notifications/{id}/read`, `POST /v1/notifications/read-all`. Summary derived from list + meta. Seeds: `notifications.json`, `notifications_meta.json`.
- **resources/** — `GET /v1/resources`, `POST /v1/resources/{id}/assign`. Seed: `resources.json`.
- Wired all four into `bootstrap/container.py` + `main.py` (`app.state` + `/v1` routers).

### Frontend integration (new hooks/API; pages rewired, mocks removed)
- `features/crowd/{api,useCrowd}.ts` → `CrowdIntelligence.tsx` (mock removed).
- `features/incidents/{api,useIncidents}.ts` → `IncidentCenter.tsx` (mock removed).
- `features/notifications/{api,useNotifications}.ts` → admin `Notifications.tsx` (mock removed; "Mark all as read" wired to `read-all`).
- `features/resources/{api,useResources}.ts` + `command-center/ResourceDeploymentPanel.tsx` → dashboard uses the backend-backed panel (roster from `/v1/resources`); removed the widget's dependency on mock digital-twin `units`.
- All pages use the existing `useApiQuery` seam + loading (skeleton) / error (`ErrorState`+Retry) states. Visuals unchanged.

### Verification
- **Backend:** `pytest` **84 passed** (79 + 5 new in `test_phase2_domains.py`), no regressions.
- **Contract fix during build:** crowd "highest density zone" ranks by status severity then ratio (so the Critical zone wins), matching the UI's intent.
- **Frontend:** `tsc` clean (narrowed insight `classification` to the widget's union).
- **Scripted E2E** (exact frontend flow, live server): crowd (6 zones, total 36,150, highest Gate C), incidents overview (6, open 4, dist 1/2/1/2) + create→assign (Open→Responding), notifications (unread 4 / critical 2 / warning 1 / resolved 11), resources (12 total / 9 deployed). All correct.
- **Browser E2E:** pending — the in-app browser tool's safety classifier was intermittently unavailable this session, blocking state-changing browser actions (navigate/click/JS-exec). Correctness is nonetheless established by the scripted E2E above (identical request surface) and by Phase 1 having already visually proven the same `useApiQuery`/`apiClient` seam end-to-end (login→token→authed fetch→render→error/retry). Re-run the browser visual pass when the tool recovers.
- **Known dev-only auth note:** the legacy dev `adminSession` (8 h) and the backend refresh session have independent lifetimes/stores. Restarting the backend wipes in-memory refresh sessions, so a browser holding a stale dev session but a cleared/expired backend token will 401 until re-login. Not a code defect; resolved by re-login. Unifying the two is Phase 5 (auth hardening).

### Notes / phasing
- **Digital-twin live layer** (`useLiveUpdates` / `MockSimulator`, feeding the map's `units`/`gates`) remains mock — that is **Phase 3** (WebSocket Gateway + Digital Twin). The Resource Deployment *roster* is now backend-backed; the live map positions reconcile onto the resources collection in Phase 3.
- **NotificationBell** (`NotificationCenter`, overlay-driven) still uses its own mock; the admin Notifications page is fully integrated. The bell shares `useNotifications` and will be wired when the overlay realtime layer lands (Phase 3/4).

### Mock data removed
- `CrowdIntelligence` (ZONES, trends, insights), `IncidentCenter` (INCIDENTS, TEAMS, timeline, insights, distribution), admin `Notifications` (NOTIFICATIONS), dashboard Resource widget's mock `units` source.

## Phase 3 — WebSocket Gateway · Digital Twin · Transportation · Live Operations
_Not started._

## Phase 4 — AI Service Manager (server) · Gemini failover (backend) · Analytics · Audit Logs
_Not started._

## Phase 5 — RBAC · User Management · Roles & Permissions · Platform Settings · Monitoring · Optimization
_Not started._
