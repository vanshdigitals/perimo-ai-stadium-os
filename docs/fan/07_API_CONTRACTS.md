# 07 · API Contracts — Fan domain

**Base:** `/v1/fan` · **Auth:** bearer JWT (`Depends(require_user)`, role `fan`) unless noted · **Errors:** existing envelope `{ "error": { "code": string, "message": string } }` with HTTP status; codes: `unauthenticated(401)`, `forbidden(403)`, `not_found(404)`, `validation_error(422)`, `conflict(409)`, `rate_limited(429)`. **Versioning:** path-prefixed `/v1`; additive changes only within v1.

All request bodies are Pydantic `extra="forbid"`. Timestamps ISO-8601 UTC. Money as `number` (2dp). These shapes are the **frozen contract** the frontend `features/fan/*/api.ts` binds to.

## Home
```
GET /v1/fan/home → 200 HomeOverview
HomeOverview {
  greeting: { name, subtitle },
  weather: { tempF, condition, icon },
  ticketPreview: TicketPreview | null,
  status: { crowd: 'low'|'moderate'|'high', gate: string, transport: 'clear'|'busy' },
  liveMatch: MatchSummary | null,
  quickActions: { id, label, icon, path }[],
  recommendations: { id, title, reason, action, aiLabeled: true }[],
  schedule: { id, time, title }[]
}
```

## Match
```
GET /v1/fan/matches/current            → Match | 204
GET /v1/fan/matches/{id}               → Match
GET /v1/fan/matches/{id}/timeline      → MatchEvent[]
GET /v1/fan/matches/{id}/lineups       → { home: Lineup, away: Lineup }
GET /v1/fan/matches/{id}/stats         → { possession:{home,away}, shots:{home,away}, ... }
Match { id, home:Team, away:Team, score:{home,away}, minute, status, kickoffAt, venue }
Team  { id, name, short, crestUrl }
MatchEvent { id, minute, type, teamId, playerId?, detail }
```

## Ticket
```
GET  /v1/fan/ticket        → Ticket        (current user's active ticket)
Ticket { id, matchId, match:MatchSummary, qrToken, seat:{section,row,number,level},
         gate:{name,level,zone}, status:'valid'|'used'|'expired', gatesOpenAt }
POST /v1/fan/ticket/validate { qrToken } → { valid:boolean, reason? }   # gate-side, staff-scoped
```

## Navigation
```
GET  /v1/fan/navigation/pois?category&floor → POI[]
POST /v1/fan/navigation/route { fromZone, toZone, stepFree:boolean } → Route
POI   { id, name, category, floor, zone, position, accessible }
Route { steps:{ order, instruction, means, distanceM }[], distanceM, etaMinutes, stepFree }
```
(Delegates to the existing `routing/` kernel + `crowd` for crowd-aware weighting.)

## Food & Store
```
GET  /v1/fan/food/vendors?dietary&sort         → Vendor[]
GET  /v1/fan/food/vendors/{id}                 → VendorDetail (menu:FoodItem[])
POST /v1/fan/food/orders { vendorId, items:[{foodItemId,qty}] } → Order (201)
GET  /v1/fan/food/orders/{id}                  → Order
Vendor { id, name, cuisine, rating, waitMinutes, imageUrl, dietary[] }
Order  { id, vendorId, status, total, items:[{name,qty,price}], createdAt }

GET  /v1/fan/store/products?category           → Product[]
GET  /v1/fan/store/products/{id}               → Product
POST /v1/fan/store/favorites { productId }      → 204   (idempotent)
DELETE /v1/fan/store/favorites/{productId}      → 204
Product { id, name, category, price, imageUrl, sizes[] }
```

## Media
```
GET /v1/fan/media/gallery?matchId&type → MediaItem[]
MediaItem { id, type:'image'|'video', thumbnailUrl, fullUrl, streamingUrl?, isMatchMoment, takenAt }
```

## Transport / Parking
```
GET /v1/fan/transport/overview → TransportOverview   (reuse existing transport contract)
GET /v1/fan/parking            → ParkingLot[]  { id, name, capacity, occupied, zone, walkMinutes }
```

## Emergency
```
POST /v1/fan/emergency { type:'medical'|'lost_child'|'security'|'fire', location, note? }
     → 201 { id, status:'dispatched', nearestExit:{name,route:Route} }
GET  /v1/fan/emergency/{id} → { id, status }
```

## Notifications / Profile / Settings
```
GET  /v1/fan/notifications                 → Notification[]
POST /v1/fan/notifications/{id}/read       → 204
GET  /v1/fan/profile                       → FanProfile
PATCH /v1/fan/profile { displayName?, avatarUrl?, ... } → FanProfile
GET  /v1/fan/settings                      → FanSettings { theme, language, privacy, permissions, offlineData }
PATCH /v1/fan/settings { ...partial }       → FanSettings
```

## AI Companion
```
POST /v1/fan/assistant/ask { message, context? } → { reply, suggestions?:string[], aiLabeled:true }
```
Server-side only (Gemini via `platform/ai/manager.py`); prompt-injection defended (free text treated as data); rate-limited. No Gemini key in the browser.

## Permissions matrix
| Endpoint group | Role |
|---|---|
| all `/v1/fan/*` reads/writes | `fan` (own resources only — server enforces `user_id` scoping) |
| `POST /ticket/validate` | `staff`/`admin` (gate scanning) |
