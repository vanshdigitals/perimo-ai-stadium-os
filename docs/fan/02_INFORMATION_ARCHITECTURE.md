# 02 · Information Architecture — Fan Experience

## Sitemap
```
/ (Landing)                         → public marketing (exists)
/get-started (Role Selection)       → role picker (exists)
/auth/fan/*                         → login · register · verify · welcome · forgot (exists)
/fan                                → Home                 [P0]
  /fan/match                        → Match Center         [P1]
  /fan/ticket                       → Digital Ticket       [P0]
  /fan/map                          → Navigation (exists)  [P0]
  /fan/explore                      → Explore Stadium      [P1]
  /fan/food                         → Food & Beverage      [P1]
  /fan/store                        → Shopping             [P2]
  /fan/transportation               → Transport (exists)   [P1]
  /fan/parking                      → Parking              [P2]
  /fan/media                        → Media / Highlights   [P2]
  /fan/emergency                    → Emergency            [P0]
  /fan/notifications                → Notifications        [P1]
  /fan/profile                      → Profile              [P1]
  /fan/settings                     → Settings             [P1]
```
All `/fan/*` routes are lazy-loaded and wrapped in `RoleProtectedRoute allowedRoles={['fan']}` (`router/index.tsx`).

## Primary navigation — reuse existing `FanLayout`
`components/layouts/FanLayout.tsx` already defines the shell: **mobile bottom bar** + **desktop left sidebar**, 5 slots:
`Home (/fan) · Navigate (/fan/map) · My Ticket (/fan/ticket) · Store (/fan/store) · AI (/fan/ai)`.

**Decision:** keep 5-slot primary nav. Secondary screens (match, food, explore, transport, parking, media, emergency, notifications, profile, settings) are reached from **Home quick actions**, contextual entry points, and the profile menu — never crammed into the bar. `/fan/ai` maps to the AI Companion (an overlay sheet, not a full nav peer — see §entry-points).

> Note: FanLayout currently links `/fan/ticket`, `/fan/store`, `/fan/ai` which are **not yet routed**. Roadmap Batch 1 adds these routes.

## Screen hierarchy
```
Home (hub)
├── Ticket        (also bottom bar)
├── Navigation    (also bottom bar) → Explore (POIs) → POI detail sheet
├── Match Center  → Timeline / Lineups / Stats / Media
├── Food          → Vendor detail → Order tracking
├── Store         (bottom bar) → Product detail → Wishlist
├── Transport     → Parking
├── Emergency     (also FAB, always reachable)
├── Notifications (bell)
└── Profile → Settings → History
AI Companion (overlay sheet, reachable from bottom bar + Home + any screen FAB)
```

## User flows (key)
**Entry & navigation (P0):** Home → "Find my seat" quick action → Ticket gate → Navigation route sheet (step-free toggle, ETA, crowd-aware) → live guidance. Exit: arrived / cancel.
**Halftime food (P1):** Home rec or Food tab → dietary filter → sort by wait → Vendor → Order → Order-status (WS `order.status`). Exit: picked up.
**Emergency (P0):** any screen FAB / Emergency tab → choose type (medical/lost-child/security/fire) → confirm location → dispatch ack + nearest exit map. Exit: resolved / cancel.
**Match follow (P1):** Home live card → Match Center (WS `match:{id}`) → tabs. Exit: back to Home.
**Departure (P0):** post-match Home banner → Transport → parking/shuttle status → departure guidance.

## Entry points
- **Deep links:** `/fan/ticket`, `/fan/map?to=seat`, `/fan/emergency`, `/fan/match` (for push notifications & QR).
- **Push/notification** → deep link into the relevant screen.
- **AI Companion** invokable anywhere (bottom bar "AI" + floating affordance).
- **Emergency FAB** persistent on Home/Map/Match.

## Exit points
Logout (FanLayout sidebar/menu) → `/auth/fan/login`. Session expiry → silent refresh; hard-fail → login. Every screen has a clear back affordance; bottom bar is the global reset.
