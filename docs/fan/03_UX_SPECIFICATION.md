# 03 · UX Specification — Fan Experience

**Conventions (apply to every screen):**
- Shell: `FanLayout` (dark `#0a0a0f`, accent `#2563EB`), mobile bottom bar / desktop sidebar. Content max-width `640px` on mobile-first screens, fluid on map/media.
- **Loading:** skeletons (never spinners on content); shell renders instantly.
- **Empty:** icon + one-line reason + primary action (reuse `EmptyState` pattern).
- **Error:** inline card, human message from `ApiError`, Retry button (reuse `ErrorState` pattern).
- **Offline:** "last updated …" banner + cached payload; writes queued (see `09_STATE_MANAGEMENT`).
- **Animation:** `framer-motion`, `ease [0.16,1,0.3,1]`, 150–400ms, `whileTap 0.98`; all gated by `useReducedMotion`.
- **Responsive:** mobile 1-col → tablet 2-col → desktop content beside sidebar. No layout compression; design each breakpoint (see `13_PERFORMANCE_GUIDE`).

---

### Fan Home `/fan` — hub, P0
- **Purpose:** answer "what now?" in one glance.
- **Layout (top→bottom):** greeting hero (name, shift-of-day, weather pill) → **Digital Ticket preview card** (tap → Ticket) → **Live status row** (crowd · gate · transport chips, WS-driven) → **Live Match card** (score/minute if in play) → **Quick Actions grid** (Find seat, Food, Emergency, AI) → **AI Recommendations** list → **Today's schedule** timeline.
- **Widgets:** `TicketPreviewCard`, `StatusChip×3`, `LiveMatchCard`, `QuickActionTile×4`, `RecommendationCard`, `ScheduleTimeline`.
- **Loading:** ticket + status + match as skeleton cards. **Empty:** no match today → "No match scheduled" hero variant. **Offline:** ticket from cache; status chips greyed "offline".
- **Motion:** staggered fade-up on mount (0.05s step).

### Match Center `/fan/match` — P1
- **Purpose:** follow the live match.
- **Layout:** large **Scoreboard** (crests, score, minute, status) → tab bar `Timeline · Lineups · Stats · Media` → tab body.
- **Widgets:** `Scoreboard`, `MatchTimeline` (goals/cards/subs), `Lineup` (formation), `StatBar` (possession/shots), `MediaCard` grid.
- **Realtime:** WS `match:{id}` patches score/timeline live. **Loading:** scoreboard skeleton + tab skeletons. **Empty:** pre-match → countdown + lineups only. **Offline:** last score + "reconnecting".

### Digital Ticket `/fan/ticket` — P0
- **Purpose:** entry credential, Apple-Wallet quality.
- **Layout:** full-bleed **TicketCard** (gradient header, match, date) → **QR** (large, centered) → seat/section/row + gate + level → **countdown to gates-open** → status badge (Valid / Used / Expired).
- **Widgets:** `TicketCard`, `QRCode`, `CountdownTimer`, `StatusBadge`.
- **Offline:** **must render fully from cache** (QR is a signed token); "offline-ready" badge. **Loading:** shimmer ticket. **Error:** "couldn't refresh — showing your saved ticket".
- **Motion:** subtle sheen sweep on the card (reduced-motion: none).

### Navigation `/fan/map` (exists) — P0
- **Purpose:** get from A→B, crowd-aware, step-free option.
- **Layout:** full-height **StadiumMap** + bottom **RouteSheet** (from/to, step-free toggle, distance, ETA, turn list) + floor switcher + POI pins.
- **Widgets:** `StadiumMap`, `RouteSheet`, `FloorSwitcher`, `POIPin`, `CrowdOverlay`.
- **Loading:** map skeleton + sheet skeleton. **Empty:** no route yet → "Where to?" search. **Offline:** cached map tiles + last route; live crowd overlay hidden.

### Explore Stadium `/fan/explore` — P1
- **Purpose:** browse POIs by category/floor.
- **Layout:** category chips (Food, Restrooms, Medical, Merch, Exits, Family, Prayer) → filtered **POIList** → POI detail sheet (distance, "Navigate").
- **Widgets:** `CategoryChips`, `POICard`, `POIDetailSheet`.

### Food & Beverage `/fan/food` — P1
- **Purpose:** find + order food fast.
- **Layout:** **DietaryFilter** row (Halal/Veg/Vegan/GF) + sort (wait/rating/distance) → **VendorCard** list (image, cuisine, rating, wait-minutes) → Vendor detail (menu) → **OrderStatus** tracker.
- **Widgets:** `DietaryFilter`, `VendorCard`, `MenuItemRow`, `OrderStatusStepper`.
- **Realtime:** `order.status` on `user:{id}`. **Empty:** filters exclude all → "No vendors match". **Loading:** vendor card skeletons.

### Shopping `/fan/store` — P2
- **Layout:** category filter → **ProductCard** grid (image, price, sizes) → product detail → **Wishlist** (client-side + `favorites`).
- **Widgets:** `ProductCard`, `ProductDetailSheet`, `WishlistButton`, `FilterBar`.

### Media / Highlights `/fan/media` — P2
- **Purpose:** match moments, photos, video previews.
- **Layout:** **Gallery** masonry (thumbnails, lazy) → lightbox for images / **VideoPreview** (poster + play → lightweight player).
- **Widgets:** `MediaGallery`, `MediaCard`, `VideoPreview`, `Lightbox`. **Perf:** lazy + skeleton; one video mounted at a time (`13_PERFORMANCE_GUIDE`).

### Transport `/fan/transportation` (exists) — P1 & Parking `/fan/parking` — P2
- Transport: parking occupancy, shuttle ETAs, road status, departure guidance. Parking: lot occupancy, saved spot, walking time to gate. **Realtime:** `transport.update`.

### Emergency `/fan/emergency` — P0
- **Purpose:** fastest path to help. **Calm, high-contrast, large targets.**
- **Layout:** four **large EmergencyAction** tiles (Medical, Lost Child, Security, Fire) → confirm-location sheet → dispatch ack + **nearest exit** mini-map → live status.
- **Widgets:** `EmergencyAction` (min 96px target), `ExitGuide`, `DispatchStatus`.
- **Motion:** none flashy; confirmation is deliberate (2-step, no accidental fire). **Offline:** attempts direct call, surfaces failure loudly + shows static exit map.

### Notifications `/fan/notifications` — P1
- Feed of alerts (critical/info/match/order), read state, tap → deep link. **Realtime:** `notification.new`. Reuse the notification visual language already built for admin (icons, priority).

### Profile `/fan/profile` & Settings `/fan/settings` — P1
- Profile: avatar, name, rewards summary, **past matches (History)**, quick links. Settings: **theme** (light/dark), **language**, privacy, permissions (location/notifications), **offline data** (cache size, clear). Reuse `AppContext` theme/language.

### AI Companion `/fan/ai` (overlay sheet) — P0-ish
- **Purpose:** conversational help, grounded.
- **Layout:** bottom-sheet/full-screen chat → message list → **suggested prompts** chips (Find food, Nearest exit, Best route, Queue times) → composer with **voice-input placeholder** (mic button, disabled tooltip "coming soon") → send.
- **Data:** `POST /v1/fan/assistant/ask` → server-side Gemini (`platform/ai/manager.py`). Every AI reply carries an **"AI"** label. **Loading:** typing indicator. **Error:** "Assistant is busy — try again."
