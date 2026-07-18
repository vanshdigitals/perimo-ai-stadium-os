# FAN_UX_REVIEW.md
### PERIMO — Product Design Review (implementation guide for Antigravity)

**Reviewer stance:** Senior Product Designer (Apple / Linear / Stripe lens).
**Method:** reviewed the *actual* current code, not the spec. Where a screen is still a `StubPage`, I say so and review the intended design.
**Golden rule for every fix below:** reuse the PERIMO design system — tokens (`#2563EB` brand, `#6B4EFF` AI accent, `#0F172A`/`#5B6472` text, `#E2E4E9` borders, `#F8FAFC` surfaces), Space Grotesk (display, 500–700) + IBM Plex Sans, 8px spacing grid, Lucide icons, `framer-motion` ease `[0.16,1,0.3,1]`, `useReducedMotion`. **Do not invent a new visual language. Light mode is the default.**

---

## 0 · System-level verdict (read first)

The Fan Home is ambitious but **off-brand in five concrete ways** that make it feel like a different product than the Landing / Role Selection / Staff portal:

| # | Issue (observed in code) | Why it breaks the "one OS" feeling | Fix |
|---|---|---|---|
| 1 | **Dark blue→indigo gradient hero** (`from-blue-600 to-indigo-700`) on a screen whose brief is *light, bright, white* | Landing & Role Selection lead with white + `#2563EB` accents; the fan Home opens dark and heavy → jarring context switch | White/`#F8FAFC` hero surface, brand accent used sparingly; the stadium art carries the color, not a full-bleed gradient |
| 2 | **Raw Tailwind palette** (`blue-600`, `indigo-700`, `slate-800`, `blue-100`) | The rest of PERIMO uses exact hex tokens; `indigo` appears nowhere else | Swap every `blue-*/indigo-*/slate-*` for the tokens above |
| 3 | **Hardcoded content** — "Argentina vs France", "1h 15m" baked into hero copy; `MatchPreviewCard`/`RecommendedFood` take no props | Violates the data contract; the Home lies when data changes | Bind to `home` (`useHome`) / feature APIs — no literals in JSX |
| 4 | **Emoji `⚠️`** in the error state + `font-black` headings | PERIMO is Lucide-only; display weight is 600–700, never 900 | `AlertTriangle` (Lucide); `font-semibold` display |
| 5 | **`if (loading \|\| !home)` → permanent skeleton** | If the API returns null/unwired, the page is *forever* a skeleton (the exact complaint) | Split states: `loading` → skeleton; `!loading && !data` → empty; `error` → error; else render |

Fix these five and the Home instantly reads as the same family as the Landing. Everything below is refinement on top.

---

## 1 · Fan Home `/fan` — *implemented, needs polish*

**What's good**
- Right *skeleton of sections*: Hero → Quick Actions → Live Info → Match Preview → Recommended Food. Good information scent.
- The desktop ticket strip (Gate / Section / Seat) is a genuinely nice touch and deserves to survive.
- Motion is present and tasteful (staggered fade-up).

**What feels empty**
- After the big hero, the page is a **vertical stack of same-weight sections** with identical uppercase `tracking-widest` headers — no rhythm, no focal point below the fold. It reads like a settings list, not a companion.
- Live Info is a flat grid with no single "right now" hero stat.

**What should be larger**
- The **Digital Ticket** is the fan's #1 job — it should be a *hero-treatment* card near the top (see "hero treatment"), not just a strip inside the hero and a CTA. On mobile it currently only exists as a cramped 3-column strip at the bottom of the hero.
- **Match countdown** deserves its own prominent, live-ticking element, not a sentence inside a paragraph.

**Information hierarchy — what's wrong**
- The hero says "You're all set" (reassurance) but buries the two things a fan actually needs *now*: **ticket** and **countdown**. Lead with those.
- Every section header is visually equal → nothing signals importance. Introduce a hierarchy: Hero (ticket+match) → Quick Actions → *then* a 2-col "Right now" (live info + AI rec) → discovery (food/store).

**Cards to remove**
- The **mobile ticket strip inside the hero** (duplicate of the desktop strip + a future dedicated Ticket preview) — remove; replace with one real `TicketPreviewCard` below the hero on mobile (the spec already calls for this).

**Cards to merge**
- **Weather pill + Crowd status + Entry gate** are three separate live signals scattered across hero + Live Info. Merge into one **"Match-day status" strip** (weather · crowd · transport · gate) directly under the hero — one glanceable row, like the Landing's floating cards but grounded.
- **Recommended Food + Store** → one "For you" discovery carousel with tabs, rather than two stacked sections.

**Spacing**
- *Too large:* `space-y-8 lg:space-y-12` between every section makes the page feel sparse and forces excess scrolling; tighten to `space-y-6 lg:space-y-8` and use section grouping instead of uniform gaps.
- *Too large:* hero `min-h-[480px]` on desktop pushes everything below the fold; ~`420px` is plenty when the ticket becomes its own card.
- *Too small:* Quick Action tiles at `gap-3` in a `grid-cols-4` on mobile get cramped labels; give them breathing room or drop to `grid-cols-4` with larger tiles / horizontal scroll.

**Animations that should exist**
- Countdown: a subtle per-second tick (opacity pulse on the seconds), reduced-motion safe.
- Live Info cards: value change → brief highlight (the "data just updated" micro-cue), reusing the pattern the admin charts use.
- Ticket card: a *very* subtle sheen sweep once on mount (not looping).

**Components that should become reusable**
- `TicketPreviewCard` (used on Home + eventually Ticket screen) — promote to `features/fan/shared`.
- `LiveStatChip` (weather/crowd/transport/gate) — one component, many instances.
- `SectionHeader` (title + optional "See all") — replace the ad-hoc `<h3 uppercase tracking-widest>`.
- `RecommendationCard` already exists — make it the canonical "AI suggestion" card app-wide, always carrying the **"AI" label** (transparency).

**Widgets that deserve hero treatment**
- **Digital Ticket** and **Live Match card** — these are the two "why I opened the app" widgets.

**Mobile**
- Replace the cramped bottom-of-hero ticket strip with a real full-width `TicketPreviewCard` below the hero.
- Quick Actions: 4-col grid is fine but enlarge tap targets to ≥ 64px and let labels wrap to two lines.
- Add the persistent **Emergency FAB** (already built in `shared/EmergencyFAB`) — it's not on Home yet.

**Desktop**
- The brief's "large stadium illustration on the right" is currently a low-opacity background image behind text. Make it a **real right-column illustration** (reuse `stadium-light.png`) beside the content, matching the Landing hero's two-column feel — that alone unifies Home with the Landing.
- Two-column below the fold (Live Info + AI rec | Match preview) instead of full-width stacks.

---

## 2 · Navigation `/fan/map` — *exists (older FanMap)*
- **Good:** a map screen exists. **Empty:** no route sheet / step-free toggle / ETA surfaced as premium UI.
- **Hierarchy:** the map should be the hero (full-height); the **RouteSheet** (from→to, step-free, distance, ETA, turn list) is a draggable bottom sheet (`shared/BottomSheet` exists — reuse it).
- **Merge:** POI filters + floor switcher into one compact top control bar.
- **Larger:** ETA + "step-free" toggle — these are the accessibility promise; make them prominent.
- **Animation:** route draw-on animation; sheet spring. **Mobile:** sheet peek state; **Desktop:** sheet becomes a left rail.

## 3 · Digital Ticket `/fan/ticket` — *STUB*
- This is the flagship screen and it's a placeholder — **highest priority to build** after Home polish.
- **Hero treatment:** one full-bleed `TicketCard` (brand gradient header — *the one place a rich gradient is on-brand*), giant centered **QR**, seat/gate/level, live **countdown**, status badge.
- **Must render offline** (spec §Offline). Reuse `TicketPreviewCard` styling scaled up.
- **Desktop:** center the ticket in a max-`480px` column on a soft `#F8FAFC` field — don't stretch it full-width.

## 4 · Match Center `/fan/match` — *not routed yet*
- **Hierarchy:** Scoreboard (hero, crests + score + minute) → tab bar (Timeline / Lineups / Stats / Media).
- **Hero widget:** the live scoreboard — big, calm, updates via WS.
- **Reusable:** `Scoreboard`, adapt the admin `Timeline`. **Empty (pre-match):** countdown + lineups only, not a blank score.
- **Merge:** possession + shots into one `StatBar` group. **Mobile:** sticky scoreboard on scroll.

## 5 · Food `/fan/food` — *STUB*
- **Hierarchy:** dietary filter + sort (by **wait time** — the differentiator) → vendor cards.
- **Hero:** the "lowest wait near you" recommendation card at top (AI-labeled).
- **Cards:** `VendorCard` (image, cuisine, rating, **wait-minutes badge**). **Empty:** filters exclude all → clear reset.
- **Reusable:** `DietaryFilter`, `OrderStatusStepper`. **Mobile:** horizontal filter chips; sticky sort.

## 6 · Store `/fan/store` — *STUB*
- Lowest priority (P2). Grid of `ProductCard`, wishlist heart, category filter. **Don't over-invest** — keep it clean, reuse `FilterBar`.
- **Merge with Food** conceptually under a "Discover" tab in the bottom bar rather than two separate destinations, if bar slots are tight.

## 7 · Parking `/fan/parking` — *STUB*
- **Merge into Transport** — parking is a section of the transport story, not a peer screen. One "Getting home" hub (transport + parking + departure guidance) is stronger than two thin screens.
- **Hero:** "your saved spot + walk time to gate."

## 8 · Emergency `/fan/emergency` — *STUB (FAB built)*
- **Highest-stakes screen; must be calmest.** Four large tiles (Medical / Lost Child / Security / Fire), ≥ 96px targets, **two-step confirm** (no accidental fire), then dispatch ack + nearest-exit mini-map.
- **No flashy motion.** High contrast. **Reuse** the `EmergencyFAB` styling for consistency; the FAB should be persistent on Home/Map/Match.
- **Larger:** everything — this screen is used under stress; oversize targets and text.

## 9 · AI Companion `/fan/ai` — *STUB*
- **Present as a bottom sheet/overlay**, reachable anywhere (bottom bar + FAB), not a buried tab.
- **Hierarchy:** message list → **suggested prompt chips** (Find food, Nearest exit, Best route, Queue times) → composer with **voice placeholder** (disabled mic + tooltip).
- **Every reply carries the "AI" label** (transparency — matches the Landing's "AI that recommends, never guesses" promise). Reuse `#6B4EFF` accent for AI surfaces (already the accent in Landing data).
- **Animation:** typing indicator; chip → prefill.

## 10 · Profile `/fan/profile` & 11 · Settings `/fan/settings` — *STUBS*
- Reuse the **admin `MyProfile`** patterns (form spacing, focus states, validation) so fan/admin feel same-family. Reuse `AppContext` theme + language.
- Profile hero: avatar + name + **rewards summary** + "past matches" history list.
- Settings: theme (light default), language, privacy, permissions, offline-data — grouped list rows, not cards.
- **Merge:** History belongs *inside* Profile, not a separate destination.

---

## Cross-module: does it feel like ONE operating system?

| Module | State | Verdict | Key unification note |
|---|---|---|---|
| **Landing** `/` | built (this session) | ✅ On-brand reference | This is the canonical look: white, `#2563EB`, Space Grotesk, floating cards. Everything should ladder up to it. |
| **Role Selection** `/get-started` | built | ✅ On-brand | 4 cards + coming-soon; matches Landing. Keep as the visual bridge into the apps. |
| **Authentication** `/auth/*` | built | 🟡 Mostly consistent | Auth pages are lighter/simpler than Landing — fine, but ensure the same Logo lockup, button radius (`rounded-xl`), and brand blue. Verify the fan auth flow hands off into the *new* Home, not the old dashboard. |
| **Staff Portal** | built (polished this session) | ✅ Strong, own identity | Correctly *operational* (dark-capable, dense). It should NOT look like the Fan app — different job. Shared primitives (cards, tokens, Lucide) keep them related. |
| **Volunteer** | exists | 🟡 Unverified | Ensure it reuses the Staff shell language (it's operational, not consumer). |
| **Admin** | built (polished) | ✅ Strong | Command-center density is correct. Shared design tokens + widget kit are the through-line. |
| **Fan** | Home built, rest stubs | 🟠 The outlier | The **only** module currently drifting from the system (the 5 issues in §0). Fixing those makes the family complete. |

**The single most important unification move:** make the **Fan Home hero light** (white/`#F8FAFC` field, real stadium illustration, brand accent) so a user moving Landing → Role Selection → Fan Home never feels the ground shift under them. Right now that transition goes bright → bright → *dark blue*, which is the jarring note.

**Consistency checklist to enforce app-wide (Antigravity):**
- One `Logo` lockup, one button system (`rounded-xl`, brand fill / ghost / outline), one card radius family (`16–28px`), one shadow scale.
- Lucide icons only (remove the `⚠️` and any emoji from fan screens).
- Tokens only — grep fan code for `indigo-`, `slate-`, `blue-600` and replace.
- Light mode default everywhere public/consumer; dark mode via the existing `ThemeToggle` only.
- Every async surface: skeleton (only while loading) → data / empty / error — never a permanent skeleton.

---

## Priority order for implementation (design POV)
1. **Fix the 5 system issues on Home** (§0) — biggest perceived-quality jump for least effort.
2. **Home hierarchy & hero-treatment** (ticket + countdown + light hero + right-column illustration).
3. **Build Digital Ticket** (flagship, currently stub).
4. **Build Emergency** (highest stakes) + wire the FAB onto Home/Map/Match.
5. **Match Center + AI Companion** (the "delight" pair).
6. Food → Navigation polish → Profile/Settings → (Store/Parking merged, lowest).

*Review only. No code written or files modified beyond this document.*
