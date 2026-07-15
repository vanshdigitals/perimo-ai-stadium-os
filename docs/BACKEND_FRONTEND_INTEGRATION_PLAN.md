# PERIMO — Backend ↔ Frontend Integration Plan

**Source of truth:** [`BACKEND_V2_ARCHITECTURE.md`](./BACKEND_V2_ARCHITECTURE.md)
**Frontend policy:** The current frontend is the **production UI**. It is **not** rewritten. This plan maps Backend V2 onto the existing screens and specifies only the *minimal* frontend changes needed to wire live data in.
**Deliverable type:** Implementation plan only — no code.

---

## 0. Ground truth: what the frontend already is

Verified from the live tree (`frontend/src/`):

- **Router** (`router/index.tsx`): all admin screens exist and are lazy-loaded behind `ProtectedRoute`:
  `/admin`, `/admin/live-ops`, `/admin/crowd`, `/admin/digital-twin`, `/admin/incidents`, `/admin/transportation`, `/admin/facilities`, `/admin/security`, `/admin/ai`, `/admin/analytics`, `/admin/users`, `/admin/roles`, `/admin/notifications`, `/admin/audit-logs`, `/admin/settings`, `/admin/help`, `/admin/docs`, `/admin/support`.
- **Shared widget kit** (`components/widgets/`): `WidgetCard`, `PageHeader`, `StatusStrip`, `KPICard`, `StatusPill`, `DataTable`, `Timeline`, `AIInsightsPanel`, `FilterBar`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, and `charts/{BarChart, AreaLineChart, DonutChart}`. **Every new integration reuses these — no new primitives.**
- **Navigation/chrome** (`components/navigation/`, `header/`, `sidebar/`, `layouts/`): `AdminHeader`, `AdminSidebar`, `NotificationBell`, `SearchBar`, `CommandPalette`, `ProfileMenu`, `WorkspaceSwitcher`, `AdminLayout`.
- **Auth** (`features/auth/services/authService.ts`): a **dev session layer already deliberately shaped to mirror Firebase Auth** — its own docstring lists the exact swap points. This is the integration template for the whole app: swap the body, keep the interface.
- **AI failover** (`features/ai/services/gemini/*`): the `GeminiServiceManager` pattern already exists client-side and is the reference implementation for Backend V2's AI Service Manager.
- **Data today:** every dashboard is fed by in-component mock data or `features/*/services/*` mock services. There is **no central API client and no data-fetching library yet** — this is the single biggest gap and the first thing Phase 1 creates.

**Integration principle for the whole plan:** introduce one **data-access seam** (an API client + typed hooks) that mirrors the shape the pages already consume, so pages change as little as possible — ideally only their import line. This is exactly the pattern `authService` already proves works.

---

## 1. Per-module mapping

For each Backend V2 module: does a frontend surface exist, the components involved, the endpoints/collections/WS events required, how to integrate, and the minimal frontend change.

### 1.1 Authentication (`security/auth/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/auth/{fan,volunteer,staff,admin}/*`, `authService.ts`, `ProtectedRoute`, `AdminMFA`, reset flows.
- **Components:** `AdminLogin`, `AdminMFA`, `AdminForgotPassword`, `AdminResetPassword`, `ForgotPassword`, `FanAuth`, `VolunteerAuth`, `StaffAuth`, `ProtectedRoute`, `ProfileMenu`.
- **Endpoints:** `POST /v1/auth/{login,refresh,logout,mfa/verify,password/forgot,password/reset}`.
- **Firestore:** `users/{userId}`, `users/{userId}/sessions/{sessionId}`.
- **WebSocket:** none for auth itself (session revocation may push `user:{id}` → `system.alert`).
- **How to integrate:** Replace the **bodies** of `authService` methods with real API calls exactly as the file's own docstring prescribes. Store the access token in memory + refresh token handling; `ProtectedRoute` continues to call `isAuthenticated()`. Add a token-refresh interceptor in the new API client.
- **Frontend changes (minimal):** `authService.ts` bodies only; add token attach/refresh in the API client. **No component/UI change.**

### 1.2 RBAC (`security/rbac/`) — **Needs Integration** (screen exists, enforcement missing)

- **Frontend exists:** Partially. `features/administration/pages/RolesPermissions.tsx` + `UserManagement.tsx` render roles/permissions, but there is **no client-side permission gating** of nav/actions yet.
- **Components:** `RolesPermissions`, `UserManagement`, `AdminSidebar` (nav items to gate), `QuickActions`/`CommandPalette` (actions to gate).
- **Endpoints:** `GET/POST /v1/roles`, `GET/POST /v1/permissions`, `POST /v1/users/{id}/roles`.
- **Firestore:** `roles/{roleId}`, `permissions/{permId}`, `user_roles/{id}`.
- **WebSocket:** `system.alert` on role change (to force a permissions refresh).
- **How to integrate:** Load the current user's permission set at session start; expose a `usePermissions()` hook + a `<Can permission="...">` guard wrapper. Gate sidebar entries and destructive actions. RolesPermissions/UserManagement pages swap mock data for the endpoints.
- **Frontend changes (minimal):** New `usePermissions` hook + `<Can>` wrapper (additive, no redesign); wire two admin pages to real endpoints; conditionally render existing nav items.

### 1.3 WebSocket Gateway (`platform/websocket/`) — **Needs Integration** (client missing)

- **Frontend exists:** Partially. `features/digital-twin/services/WebSocketClient.ts` exists but is scoped to the twin; there is no **app-wide** socket client.
- **Components:** consumed by Live Ops, Crowd, Incidents, Digital Twin, Notifications, AI Center.
- **Endpoints:** `GET /v1/ws` (authenticated upgrade).
- **Firestore:** n/a (transport).
- **WebSocket events:** all server→client events in §22 of the architecture.
- **How to integrate:** Promote a single shared socket provider (`platform/realtime`) that authenticates on connect, joins rooms (`venue:{id}:*`, `user:{id}`), and exposes `useRoom(event, handler)`. Generalize the existing twin `WebSocketClient` rather than writing a new protocol. This is **Phase 4** for most screens (polling first, sockets later).
- **Frontend changes:** New shared realtime provider + `useRoom` hook (Phase 4). No UI change.

### 1.4 Event Bus (`platform/eventbus/`) — **Backend-only** (no frontend surface)

- **Frontend exists:** N/A — internal backend spine. Its *effects* reach the frontend only as WebSocket events and API state.
- **Mapping:** none direct. Verify that the events the frontend subscribes to (§22) are exactly those the bus fans out.

### 1.5 Incident Engine (`domains/incidents/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/incidents/pages/IncidentCenter.tsx`.
- **Components:** `IncidentCenter`, `DataTable`, `Timeline` (lifecycle history), `StatusPill` (state/severity), `FilterBar`, `AIInsightsPanel` (AI summary), `CriticalAlertsWidget` (dashboard).
- **Endpoints:** `POST /v1/incidents`, `GET /v1/incidents`, `PATCH /v1/incidents/{id}`, `POST /v1/incidents/{id}/{assign,escalate}`.
- **Firestore:** `incidents/{incidentId}`, `incidents/{incidentId}/transitions/{transitionId}`.
- **WebSocket:** `incident.reported|updated|escalated|sla_breached`.
- **How to integrate:** `useIncidents()` list hook + `useIncident(id)` detail hook. Table binds to `GET`; status transitions call `PATCH`; assign/escalate buttons call their endpoints. `Timeline` binds to the `transitions` subcollection. AI summary uses `AIInsightsPanel` fed by the AI Service Manager (facts-first).
- **Frontend changes (minimal):** Swap mock array for hooks; wire existing buttons to mutations. Layout unchanged.

### 1.6 Notification Engine (`domains/notifications/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/administration/pages/Notifications.tsx` + `components/navigation/NotificationBell.tsx`.
- **Components:** `Notifications` (admin page), `NotificationBell` (header inbox), `DataTable`, `StatusPill`.
- **Endpoints:** `GET /v1/notifications`, `POST /v1/notifications/read`, `POST /v1/notifications/broadcast`.
- **Firestore:** `notifications/{notificationId}`.
- **WebSocket:** `notification.new` → `user:{id}` room.
- **How to integrate:** `useNotifications()` powers both the bell and the admin page; `notification.new` increments the bell badge live (Phase 4). Broadcast composer on the admin page calls `broadcast`.
- **Frontend changes (minimal):** Bind bell + page to the hook; badge count from unread. No redesign.

### 1.7 AI Service Manager + Gemini Failover (`platform/ai/`) — **Already Implemented (client) / Needs Integration (server)**

- **Frontend exists:** Yes, strongly. `features/ai/services/gemini/*` (`GeminiServiceManager`, `FailoverController`, `HealthMonitor`, `RetryQueue`), `useGeminiStatus`, `AIOperationsWidget`, `features/ai/pages/AICenter.tsx`, `AIInsightsPanel`.
- **Components:** `AICenter`, `AIOperationsWidget`, `RecommendationCard`, `AIInsightsPanel`, `useGeminiStatus`.
- **Endpoints:** the AI is consumed *through* domain endpoints (e.g. incident summary, assist), plus a health surface: `GET /ready` (AI pool health) and `ai.*` WS events.
- **Firestore:** n/a (keys via Secret Manager; health is in-memory/monitoring).
- **WebSocket:** `ai.degraded`.
- **How to integrate:** **Decision:** move the authoritative AI calls server-side (keys must not ship to the browser in production). The existing client `GeminiServiceManager` either (a) becomes a thin client that calls the backend AI-backed endpoints, or (b) remains for any explicitly client-only demo path. `AICenter` shows live AI health from `ai.*` events instead of client-only status.
- **Frontend changes (minimal):** Re-point `GeminiRecommendationService` from direct-Gemini to the backend endpoint; keep the widget UI. `useGeminiStatus` subscribes to `ai.degraded`.

### 1.8 Crowd Intelligence (`domains/crowd/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/crowd/pages/CrowdIntelligence.tsx`, `features/command-center/components/{CrowdIntelligenceWidget,CrowdGatesWidget,EntryGatesWidget}.tsx`.
- **Components:** `CrowdIntelligence`, `CrowdIntelligenceWidget`, `CrowdGatesWidget`, `KPICard`, `AreaLineChart`, `DonutChart`, `BarChart`.
- **Endpoints:** `GET /v1/crowd/zones`, `GET /v1/crowd/heatmap`.
- **Firestore:** `venues/{v}/crowd_levels/{zoneId}`, `venues/{v}/crowd_signals/{signalId}`.
- **WebSocket:** `crowd.level_changed`, `crowd.heatmap_updated` → `venue:{id}:crowd`.
- **How to integrate:** `useCrowd(venueId)` hook feeds page + dashboard widgets from the **single source of truth** (resolves the backend/frontend crowd-model duplication flagged in the architecture). Charts bind to zone time-series.
- **Frontend changes (minimal):** Replace mock feed with hook; live updates via room (Phase 4).

### 1.9 Digital Twin (`domains/digital_twin/`) — **Needs Integration**

- **Frontend exists:** Yes, strongly. `features/digital-twin/pages/DigitalTwinOverview.tsx`, `components/{DigitalTwinWidget,LiveMap}.tsx`, `hooks/{useGoogleMaps,useLiveUpdates}.ts`, `services/{WebSocketClient,MockSimulator}.ts`.
- **Components:** `DigitalTwinOverview`, `LiveMap`, `DigitalTwinWidget`, `useGoogleMaps`, `useLiveUpdates`.
- **Endpoints:** `GET /v1/twin/{venue}/snapshot`, `GET /v1/venues/{id}/metadata` (geometry).
- **Firestore:** `venues/{v}/{zones,edges,facilities}`, `resources`, `incidents` (twin overlays).
- **WebSocket:** `twin.delta` → `venue:{id}:twin`.
- **How to integrate:** Point `useLiveUpdates` at the real snapshot + `twin.delta` stream, **retiring `MockSimulator`** as the data source. Maps rendering is unchanged (frontend already renders Google Maps; backend supplies geometry/coordinates).
- **Frontend changes (minimal):** Swap `MockSimulator` for the real socket source behind the existing hook. Map UI unchanged.

### 1.10 Transportation (`domains/transportation/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/transportation/pages/Transportation.tsx`.
- **Components:** `Transportation`, `DataTable`, `KPICard`, `AreaLineChart`, `StatusPill`, map (optional reuse of `LiveMap`).
- **Endpoints:** `GET /v1/transport/routes`, `GET /v1/transport/eta`, vehicle positions.
- **Firestore:** `transport_routes/{routeId}`, `transport_vehicles/{vehicleId}`.
- **WebSocket:** `transport.vehicle_moved`, `transport.delay`.
- **How to integrate:** `useTransport()` hook feeds routes/ETA tables; weather-derived delay flags from the backend Weather integration appear as `StatusPill` states.
- **Frontend changes (minimal):** Swap mock for hook. No redesign.

### 1.11 Resource Deployment (`domains/resources/`) — **Needs Integration** (surfaced in Command Center)

- **Frontend exists:** Partially. `features/command-center/components/ResourceDeploymentWidget.tsx` on the dashboard; **no dedicated full page**.
- **Components:** `ResourceDeploymentWidget`, `DataTable`, `StatusPill`, `KPICard`.
- **Endpoints:** `GET /v1/resources`, `POST /v1/resources/{id}/assign`, `GET /v1/resources/recommendations`.
- **Firestore:** `resources/{resourceId}`.
- **WebSocket:** `resource.dispatched`, `resource.status_changed`.
- **How to integrate:** Wire the existing widget to `GET /v1/resources`; dispatch recommendations feed into `IncidentCenter`'s assign flow via events.
- **Frontend changes:** Widget → hook. **Optional Phase 2:** a dedicated `/admin/resources` page if operators need more than the dashboard widget (see §2.3).

### 1.12 Audit Logs (`domains/audit/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/administration/pages/AuditLogs.tsx`.
- **Components:** `AuditLogs`, `DataTable`, `FilterBar`, `StatusPill`.
- **Endpoints:** `GET /v1/audit` (RBAC: `audit:read`).
- **Firestore:** `audit_logs/{logId}` (append-only).
- **WebSocket:** none (audit is historical; optional live tail later).
- **How to integrate:** `useAudit(filters)` with server-side pagination bound to `DataTable` + `FilterBar`. Gate the route behind `audit:read`.
- **Frontend changes (minimal):** Swap mock for paginated hook; add permission gate.

### 1.13 Analytics (`domains/analytics/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/analytics/pages/Analytics.tsx`.
- **Components:** `Analytics`, `KPICard`, `BarChart`, `AreaLineChart`, `DonutChart`.
- **Endpoints:** `GET /v1/analytics/{overview,incidents,crowd}`.
- **Firestore:** `analytics_rollups/{bucketId}` (pre-aggregated read models).
- **WebSocket:** none (periodic refresh is sufficient).
- **How to integrate:** `useAnalytics(range)` feeds all charts from rollups. Date-range `FilterBar` drives the query.
- **Frontend changes (minimal):** Swap mock for hook.

### 1.14 Venues / Facilities registry (`domains/venues/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/facilities/pages/Facilities.tsx`; venue geometry also underpins Digital Twin + Wayfinding.
- **Components:** `Facilities`, `DataTable`, `StatusPill`, `FilterBar`.
- **Endpoints:** `GET/POST /v1/venues`, `GET /v1/venues/{id}/{zones,edges,facilities,metadata}`.
- **Firestore:** `venues/{venueId}/{zones,edges,facilities}`.
- **WebSocket:** none (config data; changes are infrequent).
- **How to integrate:** `useVenue(venueId)` provides geometry/facilities shared by Facilities page, Digital Twin, and any wayfinding surface. `WorkspaceSwitcher` selects the active `venueId` for the whole app (multi-tenant seam).
- **Frontend changes (minimal):** Facilities page → hook; `WorkspaceSwitcher` sets active venue context.

### 1.15 Users (`domains/users/`) — **Needs Integration**

- **Frontend exists:** Yes. `features/administration/pages/UserManagement.tsx`.
- **Endpoints:** `GET/POST/PATCH /v1/users`, `POST /v1/users/{id}/roles`.
- **Firestore:** `users/{userId}`, `user_roles/{id}`.
- **How to integrate:** `useUsers()` CRUD hook bound to the table + role-assignment modal.
- **Frontend changes (minimal):** Swap mock for hook.

### 1.16 Wayfinding (`domains/wayfinding/`) — **Backend Missing frontend admin surface / fan surface exists conceptually**

- **Frontend exists:** The reference's fan-assist form is **not** part of PERIMO's admin UI. PERIMO's fan surface is the public Role Selection / fan-auth flow, not a wayfinding widget.
- **Status:** The `/v1/assist` capability has **no current admin-facing consumer**. Optional: expose an operator "test assist" panel inside AI Center. Not required for launch.
- **Recommendation:** Keep the endpoint; surface it later as a diagnostic panel in `AICenter` if desired. No new page needed for Phase 1–2.

### 1.17 Monitoring (`core` + `platform` hooks) — **Frontend Missing** (see §2.1)

- **Frontend exists:** No dedicated system-health/observability screen. `features/command-center/components/{SystemHealthWidget,PlatformHealthStrip,TelemetryBar}.tsx` show *slices* on the dashboard but there is no consolidated ops-health page.
- **Recommendation:** Build a **System Health** page (§2.1) surfacing `/ready` checks, AI pool health, event-bus lag, WS connections, rate-limit rejections.

### 1.18 Background Jobs (`platform/jobs/`) — **Frontend Missing (optional)** (see §2.2)

- **Frontend exists:** No. Job runs/SLA scans/rollup status are invisible to operators.
- **Recommendation:** Optional **Jobs & Automation** panel (§2.2), or fold job status into the System Health page. Low priority.

### 1.19 Maps & Weather Integration (`platform/maps`, `platform/weather`) — **Needs Integration (embedded)**

- **Frontend exists:** Maps yes (Digital Twin / `LiveMap`). Weather has **no dedicated surface** but feeds Transportation + operational alerts.
- **How to integrate:** Maps geometry from `/v1/venues/{id}/metadata`; weather surfaces as delay flags on Transportation and as `system.alert` banners. No standalone weather page needed — embed a compact weather/ops-conditions strip on Live Ops (minimal addition).

---

## 2. New frontend screens (where no surface exists)

All new pages **reuse the existing widget kit and design system** — same `PageHeader`, `WidgetCard`, `DataTable`, charts, `EmptyState`/`ErrorState`/`LoadingSkeleton`. No new visual language.

### 2.1 System Health & Observability — *Frontend Missing*

- **Why needed:** Backend V2 adds real-time infra (event bus, WS, AI pool, jobs, rate limiting). Operators need one screen to see platform health; today it's scattered across three dashboard widgets.
- **Route:** `/admin/system-health` (add to router + `AdminSidebar` under a "Platform" group).
- **Layout:** `PageHeader` + `StatusStrip` (overall status) → Bento grid of `WidgetCard`s.
- **Widgets:** service readiness matrix (Firestore / Redis / Pub-Sub / AI pool), AI failover health (reuse `useGeminiStatus` visualization), WS connection count, event-bus lag.
- **Charts:** `AreaLineChart` (latency over time), `BarChart` (rate-limit rejections by endpoint).
- **Tables:** recent `system.alert` events (`DataTable`).
- **Filters:** time-range `FilterBar`.
- **AI components:** `AIInsightsPanel` — "what's degraded and why" summary (facts-first).
- **States:** `EmptyState` ("All systems nominal"), `LoadingSkeleton` (KPI + chart skeletons), `ErrorState` (health endpoint unreachable).
- **Data:** `GET /ready`, `GET /metrics`; WS `ai.degraded`, `system.alert`.

### 2.2 Jobs & Automation *(optional, low priority)* — *Frontend Missing*

- **Why needed:** Visibility into SLA scans, analytics rollups, retention jobs.
- **Route:** `/admin/jobs` (or a tab on System Health).
- **Layout:** `PageHeader` → `DataTable` of job runs (name, schedule, last run, status, duration).
- **Widgets/Charts:** `KPICard` (success rate), `BarChart` (runs/day).
- **Filters:** status + job-name `FilterBar`.
- **States:** standard empty/loading/error.
- **Data:** `GET /v1/jobs` (add to backend job module surface) or fold into `/metrics`.

### 2.3 Resource Deployment (full page) *(optional)* — *Frontend Missing (widget-only today)*

- **Why needed:** Only a dashboard widget exists; dispatch-heavy events may need a full board.
- **Route:** `/admin/resources`.
- **Layout:** `PageHeader` → split: `DataTable` (units) + `LiveMap` (positions) + recommendations panel.
- **Widgets:** `KPICard` (available/deployed), `ResourceDeploymentWidget` (reused), `AIInsightsPanel` (dispatch suggestions).
- **States:** standard.
- **Data:** `GET /v1/resources`, `/recommendations`; WS `resource.*`.

> Screens 2.2 and 2.3 are **optional** — only build if operators need more than the existing dashboard widgets. Everything else in §1 already has a home.

---

## 3. Master mapping table

| Backend Module | Frontend Screen / Surface | Status |
|---|---|---|
| Authentication | `features/auth/*`, `authService`, `ProtectedRoute` | **Needs Integration** |
| RBAC | `RolesPermissions`, `UserManagement`, nav gating | **Needs Integration** |
| WebSocket Gateway | shared realtime provider (generalize twin client) | **Needs Integration** |
| Event Bus | *(internal — no direct surface)* | **Backend Missing** *(N/A frontend)* |
| Incident Engine | `IncidentCenter`, `CriticalAlertsWidget` | **Needs Integration** |
| Notification Engine | `Notifications`, `NotificationBell` | **Needs Integration** |
| AI Service Manager + Gemini Failover | `AICenter`, `AIOperationsWidget`, `gemini/*` | **Already Implemented** (client) → re-point to server |
| Crowd Intelligence | `CrowdIntelligence`, crowd widgets | **Needs Integration** |
| Digital Twin | `DigitalTwinOverview`, `LiveMap`, `useLiveUpdates` | **Needs Integration** |
| Transportation | `Transportation` | **Needs Integration** |
| Resource Deployment | `ResourceDeploymentWidget` (+ optional page) | **Needs Integration** |
| Audit Logs | `AuditLogs` | **Needs Integration** |
| Analytics | `Analytics` | **Needs Integration** |
| Venues / Facilities | `Facilities`, `WorkspaceSwitcher` | **Needs Integration** |
| Users | `UserManagement` | **Needs Integration** |
| Wayfinding (`/assist`) | *(no admin consumer; optional AI Center panel)* | **Frontend Missing** *(optional)* |
| Monitoring | System Health page | **Frontend Missing** |
| Background Jobs | Jobs page / System Health tab | **Frontend Missing** *(optional)* |
| Maps Integration | `LiveMap` / Digital Twin (embedded) | **Needs Integration** |
| Weather Integration | Transportation flags + Live Ops strip (embedded) | **Needs Integration** |

**Tally:** 13 Needs Integration · 1 Already Implemented (re-point) · 3 Frontend Missing (1 required + 2 optional) · Event Bus is internal.

---

## 4. Implementation roadmap

### Phase 1 — Backend integration for existing screens (the data seam)

Goal: stand up the one missing seam — an API client + typed hooks + auth token flow — and prove it end-to-end on 2–3 screens.

- **Files to create:**
  - `frontend/src/platform/api/client.ts` — fetch wrapper (base URL, auth header, refresh interceptor, error normalization).
  - `frontend/src/platform/api/types.ts` — shared response/error types.
  - `frontend/src/platform/query/` — data-fetching setup (query client provider).
  - `frontend/src/hooks/data/{useIncidents,useCrowd,useAnalytics}.ts` — first three hooks.
- **Files to modify:**
  - `features/auth/services/authService.ts` — swap bodies to real `/v1/auth/*` calls (per its own docstring).
  - `app` root — mount the query provider + active-venue context (from `WorkspaceSwitcher`).
- **Dependencies:** a data-fetching/caching lib (e.g. TanStack Query) + the fetch client. No UI libs.
- **APIs:** `/v1/auth/*`, `/v1/incidents`, `/v1/crowd/*`, `/v1/analytics/*`.
- **Firestore:** `users`, `sessions`, `incidents`, `crowd_levels`, `analytics_rollups`.
- **WebSocket:** none yet (polling).
- **Testing checklist:**
  - [ ] Login → token stored → protected route renders; refresh rotates token; logout clears session.
  - [ ] `useIncidents` renders live list in `IncidentCenter`; 401 triggers refresh-then-retry.
  - [ ] Loading shows `LoadingSkeleton`; network error shows `ErrorState`; empty shows `EmptyState`.
  - [ ] No console errors; existing layout visually unchanged (screenshot diff).

### Phase 2 — Build missing frontend screens

Goal: add the one required new screen (System Health) and optional ones, all from the existing kit.

- **Files to create:**
  - `features/system-health/pages/SystemHealth.tsx` (+ small widgets if needed).
  - *(optional)* `features/jobs/pages/Jobs.tsx`, `features/resources/pages/ResourceDeployment.tsx`.
  - `hooks/data/{useSystemHealth,useJobs,useResources}.ts`.
- **Files to modify:**
  - `router/index.tsx` — add `/admin/system-health` (+ optional routes) behind `ProtectedRoute`.
  - `components/sidebar/AdminSidebar.tsx` — add nav entries (gated by RBAC).
- **Dependencies:** none new (reuse widgets/charts).
- **APIs:** `GET /ready`, `GET /metrics`, `/v1/jobs`, `/v1/resources`.
- **Firestore:** `resources`; jobs/metrics via monitoring surface.
- **WebSocket:** `ai.degraded`, `system.alert` (subscribed in Phase 4).
- **Testing checklist:**
  - [ ] New routes reachable + gated; sidebar entries appear only with permission.
  - [ ] Widgets render with real `/ready` data; degraded state renders correctly.
  - [ ] Visual consistency check vs. existing pages (spacing, `WidgetCard`, typography).
  - [ ] Empty/loading/error states all reachable.

### Phase 3 — Replace mock data with backend APIs (remaining screens)

Goal: retire every remaining mock service; every dashboard reads live data.

- **Files to create:** `hooks/data/{useNotifications,useAudit,useUsers,useRoles,useVenue,useTransport,useDigitalTwin}.ts`.
- **Files to modify:** each page swaps its mock import for the hook — ideally a one-line change:
  - `Notifications.tsx`, `NotificationBell.tsx`, `AuditLogs.tsx`, `UserManagement.tsx`, `RolesPermissions.tsx`, `Facilities.tsx`, `Transportation.tsx`, `DigitalTwinOverview.tsx`, `Analytics.tsx`, `CrowdIntelligence.tsx`, command-center widgets.
  - Delete/retire mock services: `features/*/services/Mock*.ts`, `features/digital-twin/services/MockSimulator.ts`, `features/utility-panel/services/*` (as each is replaced).
  - `GeminiRecommendationService.ts` — re-point from direct-Gemini to backend AI endpoint.
- **Dependencies:** none new.
- **APIs:** all remaining `/v1/*` domain endpoints.
- **Firestore:** all remaining collections (§19 of architecture).
- **WebSocket:** none yet.
- **Testing checklist:**
  - [ ] Grep confirms no remaining `Mock*`/hardcoded-array imports in pages.
  - [ ] RBAC gating verified: restricted user cannot load `audit-logs`/`settings` data.
  - [ ] Crowd numbers match between `CrowdIntelligence` and dashboard widget (single source of truth).
  - [ ] Pagination/filters hit the server, not client-side slicing.
  - [ ] AI recommendations come from backend; keys absent from the browser bundle (verify build output).

### Phase 4 — Replace polling with WebSockets

Goal: promote a shared realtime layer; live screens push instead of poll.

- **Files to create:**
  - `platform/realtime/SocketProvider.tsx`, `platform/realtime/useRoom.ts`.
- **Files to modify:**
  - `features/digital-twin/services/WebSocketClient.ts` → generalize into the shared client (or wrap it).
  - `features/digital-twin/hooks/useLiveUpdates.ts` → consume `twin.delta` from the shared provider.
  - `IncidentCenter`, `CrowdIntelligence`, `NotificationBell`, `AICenter`, `Transportation`, System Health → subscribe via `useRoom` to their events; query cache updates on push.
- **Dependencies:** none new (native WebSocket).
- **APIs:** `GET /v1/ws`.
- **WebSocket events:** `incident.*`, `crowd.*`, `notification.new`, `resource.*`, `transport.*`, `twin.delta`, `ai.degraded`, `system.alert`.
- **Testing checklist:**
  - [ ] Socket authenticates on connect; reconnects with backoff on drop; rejoins rooms.
  - [ ] Incident/crowd/notification updates appear without refresh; no duplicate rows.
  - [ ] Falls back to polling if WS unavailable (graceful degradation).
  - [ ] Room scoping correct — switching venue in `WorkspaceSwitcher` re-subscribes.
  - [ ] No memory leaks on unmount (handlers removed).

### Phase 5 — Production optimisation

Goal: harden, trim, and verify for launch.

- **Files to modify:** query cache config (stale times, retries), `router` (route-level code-split already in place — verify), image/asset loading on public pages, CSP for new API/WS origins.
- **Dependencies:** none new; audit and prune.
- **Focus areas:**
  - Cache tuning per domain (audit/analytics long, crowd/incidents short).
  - Bundle audit — confirm no server secrets, tree-shake retired mock services.
  - Error/telemetry — surface API/WS failures into System Health.
  - Accessibility + reduced-motion regression pass on any new screens.
- **APIs / WS:** all — under load.
- **Testing checklist:**
  - [ ] Lighthouse/perf pass on Command Center + new pages (no regression vs. baseline).
  - [ ] Reconnect storm test (WS server bounce) — UI stays usable, no error spam.
  - [ ] RBAC deny-by-default verified across every route and destructive action.
  - [ ] Bundle contains no API keys/secrets; CSP allows only intended API/WS origins.
  - [ ] Full offline-degradation test: backend down → every page shows `ErrorState`, app never white-screens.

---

## 5. Cross-cutting integration notes

- **One seam, many hooks.** Every screen change reduces to "swap mock import → data hook." This is only possible because Phase 1 builds the API client + query layer first. Do not integrate screens before the seam exists.
- **`authService` is the pattern.** Its interface-preserving, body-swapping design is the template for every mock service replacement — keep the consumer-facing shape identical.
- **Active venue is app-wide context.** `WorkspaceSwitcher` sets `venueId`; every hook and every WS room is venue-scoped. This is the multi-tenant seam — wire it in Phase 1 even before multiple venues exist.
- **Minimal UI churn is a hard constraint.** No page's layout, spacing, or component tree changes during integration — only its data source. New pages (§2) are the only additive UI, and they're assembled entirely from the existing kit.
- **Facts-first AI everywhere.** Any `AIInsightsPanel`/recommendation surface consumes a backend endpoint that resolved facts deterministically first — the frontend never calls a model to *decide*, only to *phrase*.

---

*Plan only — no code. Sequence: build the data seam (P1) → add the one required new screen (P2) → retire all mocks (P3) → go real-time (P4) → harden (P5). The frontend's visual language is preserved throughout.*
