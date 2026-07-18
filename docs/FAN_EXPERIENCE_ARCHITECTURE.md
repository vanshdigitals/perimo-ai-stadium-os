# PERIMO — Fan Experience Architecture

**Status:** design blueprint (implementation staged separately)
**Scope:** the Fan Experience module — flagship consumer PWA + its FastAPI backend.
**Design system:** reuse the established PERIMO tokens, typography, spacing, motion and components. This document introduces **no** new design language.

> **Honest current-state note (read first).** This blueprint is written against the *actual* codebase, not an idealized one:
> - The **frontend Fan shell already exists** (`components/layouts/FanLayout.tsx` — dark immersive layout, bottom nav Home / Navigate / My Ticket / Store / AI, desktop sidebar) plus 4 pages (`FanDashboard`, `FanMap`, `FanTransport`, `FanFacilities`) and the fan auth flow.
> - The **backend is FastAPI** with a repository layer over a **pluggable `DocumentStore`** (in-memory seeded fixtures by default; a Firestore adapter exists). **There is no PostgreSQL, SQLAlchemy, Alembic, or Redis wired yet** — that is the (unstarted) Phase 2 of backend productionization.
> - This doc therefore specifies the **PostgreSQL/SQLAlchemy target** *and* a compatibility path that lets the frontend ship now against the existing store, with the persistence swapped underneath the repositories without changing API contracts.

---

## 1. Principles

1. **Feature-first, co-located.** Each fan feature owns its `api.ts`, hooks, components and types.
2. **One data seam.** All network access goes through the existing `platform/api/client.ts` (bearer, refresh, timeout, retry) and typed feature `api.ts` files. Nothing calls `fetch` directly.
3. **Contract stability.** REST/WS response shapes are frozen contracts; the persistence layer (fixtures → Postgres) changes *beneath* the repositories.
4. **PWA-native, offline-tolerant, accessible (WCAG AA), reduced-motion safe.**
5. **No fabricated complexity.** Simple modules, excellent boundaries.

## 2. Frontend folder structure

```
frontend/src/
├── features/fan/
│   ├── home/            api.ts · useHome.ts · components/*
│   ├── match/           api.ts · useMatch.ts · components/{Scoreboard,Timeline,Lineups,Stats}
│   ├── ticket/          api.ts · useTicket.ts · components/{TicketCard,QрCode}
│   ├── navigation/      api.ts · useRoute.ts · components/{StadiumMap,RouteSheet}
│   ├── explore/         api.ts · components/{POIList,POICard}
│   ├── food/            api.ts · useFood.ts · components/{VendorCard,OrderStatus,DietaryFilter}
│   ├── shopping/        api.ts · useStore.ts · components/{ProductCard,Wishlist}
│   ├── transport/       (exists) FanTransport
│   ├── parking/         api.ts · components/*
│   ├── emergency/       api.ts · components/{EmergencyAction,ExitGuide}
│   ├── notifications/   api.ts · useNotifications.ts
│   ├── profile/         api.ts · components/*
│   ├── settings/        api.ts · components/*
│   ├── media/           api.ts · components/{Gallery,MediaCard,VideoPreview}
│   └── shared/          FanScreen, FanHeader, SectionCard, StatPill, Skeletons
├── pages/fan/           thin route pages composing feature modules
├── components/layouts/FanLayout.tsx   (exists — reused)
└── platform/api/        (exists — reused: client, tokenStore, auth)
```

## 3. Feature modules & routes

| Route | Screen | Module | Primary data |
|---|---|---|---|
| `/fan` | Home | home | greeting, upcoming match, ticket preview, crowd/weather/transport status, AI recs, quick actions |
| `/fan/match` | Match Center | match | scoreboard, timeline, possession, stats, lineups, highlights |
| `/fan/ticket` | Digital Ticket | ticket | QR, seat, gate, countdown, status (offline-ready) |
| `/fan/map` | Navigation *(exists)* | navigation | stadium map, POIs, crowd-aware route, ETA |
| `/fan/explore` | Explore Stadium | explore | POIs by category & floor |
| `/fan/food` | Food & Beverage | food | vendors, wait time, dietary filters, order status |
| `/fan/store` | Shopping | shopping | products, filters, wishlist |
| `/fan/transportation` | Transport *(exists)* | transport | parking, shuttle ETA, road status |
| `/fan/parking` | Parking | parking | lot occupancy, saved spot |
| `/fan/emergency` | Emergency | emergency | medical / lost child / security / fire / exit guidance |
| `/fan/notifications` | Notifications | notifications | alerts feed |
| `/fan/profile` | Profile | profile | preferences, rewards, history |
| `/fan/settings` | Settings | settings | theme, language, privacy, permissions, offline |

Routing stays lazy-loaded under `RoleProtectedRoute allowedRoles={['fan']}` in `router/index.tsx`.

## 4. State management

- **Server state:** the existing `useApiQuery` seam (loading/error/empty/data + refetch, abort-on-unmount). Add a light in-memory cache keyed by endpoint for instant back-navigation.
- **Realtime state:** a `FanRealtimeProvider` subscribing to the WS gateway; pushes patch query caches (match score, crowd, gate, emergency).
- **UI/session state:** existing `AppContext` (theme, language, toasts) — reused, not replaced.
- **Persistent local:** `localStorage` for the cached ticket + offline snapshot (see §9).

## 5. API contracts (REST, under `/v1/fan`)

All authenticated (bearer), all returning the backend's typed envelope; errors as `{error:{code,message}}`.

```
GET  /v1/fan/home                 → HomeOverview (match, ticketPreview, crowd, weather, transport, recs, quickActions)
GET  /v1/fan/matches/current      → Match (teams, score, status, minute)
GET  /v1/fan/matches/{id}/timeline
GET  /v1/fan/matches/{id}/lineups
GET  /v1/fan/matches/{id}/stats
GET  /v1/fan/ticket               → Ticket (qrToken, seat, gate, section, matchId, status, gatesOpenAt)
GET  /v1/fan/navigation/pois      → POI[] (?category, ?floor)
POST /v1/fan/navigation/route     → Route (steps, distance, etaMinutes, stepFree)
GET  /v1/fan/food/vendors         → Vendor[] (name, cuisine, rating, waitMinutes, image, dietary[])
POST /v1/fan/food/orders          → Order ; GET /v1/fan/food/orders/{id} → Order (status)
GET  /v1/fan/store/products       → Product[] (?category) ; wishlist client-side + POST /favorites
GET  /v1/fan/transport/overview   → (exists) TransportOverview
GET  /v1/fan/parking              → ParkingLot[]
GET  /v1/fan/media/gallery        → MediaItem[] (thumbnailUrl, fullUrl, type, matchMoment?)
GET  /v1/fan/notifications        → Notification[]
GET  /v1/fan/profile              → FanProfile ; PATCH /v1/fan/profile
GET  /v1/fan/settings             → FanSettings ; PATCH /v1/fan/settings
POST /v1/fan/emergency            → EmergencyTicket (type, location) → dispatch ack
POST /v1/fan/assistant/ask        → AssistantReply (grounded; server-side Gemini via existing ai_manager)
```

**Reuse:** the assistant endpoint routes through the existing server-side `platform/ai/manager.py` (Gemini failover) — **no Gemini key in the browser**.

## 6. Backend architecture (FastAPI)

New domain package `backend/src/domains/fan/` following the established 4-layer shape (`schema.py` → `repository.py` → `service.py` → `router.py`), one sub-service per concern (home, match, ticket, navigation, food, store, media, notifications, profile, settings, emergency, assistant). Composed in `bootstrap/container.py`; routers mounted under `/v1/fan`. Domain services publish events to the existing `EventBus` (already fanned out by the WS gateway).

## 7. Database design (SQLAlchemy — target)

Introduced in Phase 2 behind a `SqlDocumentStore`/repository implementation that keeps the current interface, so fixtures → Postgres is transparent to services and the frontend.

```
users(id, email, display_name, role, locale, created_at)
matches(id, home_team, away_team, kickoff_at, venue, status, home_score, away_score, minute)
teams(id, name, short, crest_url)  · players(id, team_id, name, number, position)
match_events(id, match_id, minute, type, team_id, player_id, detail)          # goals, cards, subs
tickets(id, user_id, match_id, seat_id, gate_id, qr_token, status, issued_at)
seats(id, section, row, number, level)  · gates(id, name, level, zone)
vendors(id, name, cuisine, rating, level, zone, image_url)
food_items(id, vendor_id, name, price, prep_minutes, dietary[])               # halal/veg/vegan/gluten-free
orders(id, user_id, vendor_id, status, total, created_at)  · order_items(order_id, food_item_id, qty)
products(id, name, category, price, image_url, sizes[])  · favorites(user_id, product_id)
media(id, match_id, type, thumbnail_url, full_url, is_match_moment, taken_at)  # type: image|video
notifications(id, user_id, category, title, body, read, created_at)
navigation_routes(id, from_zone, to_zone, step_free, distance_m, eta_minutes)
emergencies(id, user_id, type, location, status, created_at)
parking_lots(id, name, capacity, occupied, zone)
```

Indexes on FKs + `matches.status`, `tickets.user_id`, `orders.user_id`, `notifications.user_id`. Alembic migrations per model group. **Not implemented until a Postgres instance exists** (env `DATABASE_URL`).

## 8. WebSocket events (existing `/v1/ws` gateway, room-based)

| Room | Events | Drives |
|---|---|---|
| `match:{id}` | `match.score`, `match.event`, `match.status` | live scoreboard/timeline |
| `crowd` | `crowd.level_changed` | Home crowd status, map density |
| `gates` | `gate.status` | Home/navigation gate flow |
| `transport` | `transport.update` | Home/transport status |
| `emergency` | `emergency.alert` | full-screen alert widget |
| `user:{id}` | `notification.new`, `order.status` | bell + order tracking |

Client: a `FanRealtimeProvider` that authenticates the socket (token), joins the fan's rooms, reconnects with backoff, sends `ping`, and patches query caches on push. **Graceful degradation:** if WS is unavailable, screens fall back to REST polling.

## 9. Offline strategy (PWA)

- **App shell + static assets:** service-worker precache (Vite PWA-style), cache-first.
- **Digital ticket:** persisted to `localStorage` on fetch and rendered from cache when offline (QR is a signed token, valid without network). An `offline` state badge is shown.
- **Read models (home/match/food):** stale-while-revalidate; last good payload shown with an "offline — last updated …" banner.
- **Writes (orders, emergency):** queued and replayed on reconnect; emergency additionally attempts a direct call and surfaces failure loudly.

## 10. Image strategy

- **Reuse first:** existing `assets/stadium-light.png` / `stadium-dark.png` / `logo` for hero/branding.
- **Remote media:** `thumbnail_url` (small, lazy) + `full_url` (on demand). Every `<img>` has explicit `width`/`height` to prevent CLS, `loading="lazy"` except above-the-fold, skeleton placeholder, and an `onError` fallback to a branded gradient block — **layout never breaks on a missing asset**.
- **No low-quality stock.** Where an asset is genuinely absent, render an elegant SVG/gradient illustration in-system.

## 11. Video strategy

- **Never embed large video.** Match moments/highlights use a **poster thumbnail + play affordance**; tapping opens a lightweight player fed by a `streaming_url` (HLS/MP4) — lazy-mounted, one at a time, paused off-screen.
- Autoplay disabled; respects reduced-motion and data-saver.

## 12. Security

- **JWT access + refresh** (existing `security/auth`), silent refresh via the API client's 401 flow, `RoleProtectedRoute allowedRoles={['fan']}`.
- **Server-side validation** (Pydantic `extra="forbid"`, bounded fields).
- **Rate limiting** on write/assistant endpoints (existing token-bucket limiter; Redis-backed at scale).
- **No secrets in the browser** — Gemini/Maps keys are server-side or restricted-referrer.
- **QR tokens** are short-lived signed tokens, validated server-side at the gate.

## 13. Performance

- Route-level code splitting (already in place via `React.lazy`), `Suspense` fallbacks.
- Skeletons for every async surface; memoized list rows; virtualized long lists (food/store/media).
- Image lazy-loading + intrinsic sizing (no CLS); prefetch the next likely route (ticket, map) on Home idle.
- Realtime patches instead of refetch; abort in-flight requests on unmount.

## 14. Implementation roadmap (honest sequencing)

| Stage | Deliverable | Depends on |
|---|---|---|
| **A. Frontend, store-agnostic** | Fan Home, Ticket, Match, Food, Explore, Emergency, Profile, Settings against `/v1/fan/*` (served initially by the existing fixture store) | none — ships now |
| **B. Backend fan domain (FastAPI)** | `domains/fan/*` services + routers returning the contracts above from the fixture store | none — current stack |
| **C. Realtime** | `FanRealtimeProvider` on the existing WS gateway | gateway (exists) |
| **D. Persistence** | SQLAlchemy models + Alembic + `SqlDocumentStore`; swap fixtures → Postgres behind the repositories | a provisioned Postgres (`DATABASE_URL`) — **prerequisite not yet met** |
| **E. Media/offline/PWA hardening** | service worker, offline ticket, media player | A–C |

**What blocks a literal "complete frontend + backend" today:** Stage D requires a real PostgreSQL instance and Alembic wiring that do not exist in this environment yet, and cannot be provisioned or verified from here. Stages A–C are buildable now on the existing FastAPI + fixture store, keeping every contract Postgres-ready.

---

*Architecture only. No application code changed by this document.*
