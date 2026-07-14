# PERIMO Command Center — Information Architecture & Bento Grid Redesign

**Scope:** Dashboard content area only (`AdminDashboard.tsx` widget canvas).
**Explicitly untouched:** Header, Sidebar, Utility Panel, theme, color system, typography, design tokens, overall visual identity.
**Design mandate:** Observe → Detect → Decide → Act, understood within 5 seconds, at the density and reliability of a real FIFA World Cup / Olympics / F1 / national-emergency operations room.

---

## Executive Summary

The current build (`AdminDashboard.tsx`) has good component quality but a flat information architecture: everything is a similarly-sized white rounded card in a rigid 7/5 two-column stack. Three structural problems block the "command center feel":

1. **System Health is a collapsed accordion** (`isSystemHealthExpanded` defaults to `false`) buried at the bottom of the left column — platform status must never be one click away from invisible.
2. **The AI Copilot sits *below* the Digital Twin**, in the same column, meaning the second-most-important surface in the product is off-screen on first paint.
3. **Crowd Intelligence and Entry Gates Throughput independently visualize the same `gates[]` data** (occupancy, flow rate, wait level) — two cards, one dataset, duplicated scanning effort.

This document restructures the canvas into a **7-card, 2-strip Bento Grid** that fixes all three, ranks every widget by operational priority, and defines exact sizing, spacing, and scan-flow rules so the layout reads as a command center — not a SaaS admin panel — from the first frame.

---

## 1. Widget Audit

| # | Widget (current) | Verdict | Rationale |
| --- | --- | --- | --- |
| 1 | `TelemetryBar` | **Expand → Live Operations Summary** | Already a horizontal facts strip (Match, Venue, Attendance, Weather, Local Time). Structurally correct pattern — needs more fields, not a new widget. |
| 2 | `SystemHealthWidget` | **Rebuild → Platform Health strip** | Currently a click-to-expand accordion showing infra metrics (uptime, latency, IoT nodes, camera count). Must become a permanent, non-collapsible strip with operator-relevant rows only. |
| 3 | `DigitalTwinWidget` | **Keep, expand width + role** | Correctly the anchor. Already has layer toggle, floor selector, zoom, connection telemetry — the right foundation, wrong amount of canvas. |
| 4 | `AIOperationsWidget` / `RecommendationCard` | **Keep, expand + restructure** | Genuinely close to an Ops Assistant already (classification, confidence, approve/dismiss, confirm modal). Needs risk score, reasoning pane, decision timeline — and a permanent seat beside the map, not below it. |
| 5 | `CriticalAlertsWidget` | **Keep, absorb Emergency Queue + timeline** | The severity-rail + status-chip pattern (Active/Responding/Monitoring/Resolved) is the correct PagerDuty-style pattern. Becomes the home for triage, not just a list. |
| 6 | `CrowdIntelligenceWidget` | **Merge with Entry Gates Throughput** | Same entity (`gates[]`), same fields, two chart styles. One widget, one toggle. |
| 7 | `EntryGatesWidget` | **Merge into Crowd & Gates Intelligence** | See above — this is a view mode, not a separate widget. |

**Net result:** 7 source components → **5 cards + 2 persistent strips.** Nothing is deleted for aesthetics; every merge removes a genuine duplicate read.

---

## 2. Missing Widgets (Added, With Justification)

| Widget | Add? | Why |
| --- | --- | --- |
| **Live Operations Summary** | ✅ Yes (extend `TelemetryBar`) | The single "Observe in 5 seconds" surface — match, attendance, weather, open gates, security posture, medical posture in one glance. |
| **Platform Health** (rebuilt System Health) | ✅ Yes | Non-negotiable ambient status: Platform, Database, API, WebSocket, Maps, AI, Storage. Matches how Google Cloud Console and Datadog treat platform status — always visible, never a click away. |
| **Resource Deployment** | ✅ Yes | The codebase's own mock data (`MockSimulator.ts`) already models security/medical/police/maintenance unit types and active/busy/offline status — this data currently has *zero* UI representation. It answers "who is already responding," which is distinct from "what happened" (Alerts) and "what should we do" (AI Copilot). |
| **Emergency Response Timer** | ✅ Yes, but *inside* Critical Alerts, not standalone | A live count-up per active P1 incident ("Medical Assistance — 02:14 elapsed") is high-value (ATC/PagerDuty pattern) but is a per-item element, not a card of its own. |
| Emergency Queue | ⚠️ Folded into Critical Alerts | A separate "queue" card next to an "alerts" card creates two places to check the same thing. Instead, Critical Alerts gets a pinned top section for active/unacknowledged P1 items, visually separated from the general feed below it. |
| Active Incidents / Recent Events / Live Timeline | ⚠️ Folded into Critical Alerts as a **Feed / Timeline** tab | Same entity as alerts, different time-lens. A tab, not a card. |
| Camera Status / Active Cameras | ⚠️ Folded into Platform Health (one status row) + Digital Twin overlay | A full camera wall belongs on a dedicated video-ops monitor, not the primary command canvas. The command center needs to know "244/245 online," and needs to click a map pin to see a feed — not scroll a grid of thumbnails. |
| Medical Operations / Security Operations | ⚠️ Folded into Resource Deployment | These are two rows inside one "who's deployed" widget, not two additional cards. |
| Parking, Transport Status | ⚠️ Folded into Live Operations Summary as single stat chips | One number each ("Parking 84%", "Transport: Nominal"). A whole card for one stat is exactly the "SaaS dashboard" pattern this redesign is correcting. |
| Weather | ⚠️ Already a chip in the summary strip + becomes a Digital Twin overlay layer | No separate card needed. |
| Connectivity | ⚠️ Folded into Platform Health (WebSocket/API/Maps rows already cover it) | Duplicate of Platform Health if separated. |
| **Communication Status (radio/comms network)** | ❌ Deferred | No data model exists anywhere in the codebase for a physical comms/radio network. Building a UI for a system with no backing data is a prop, not a widget. Revisit once a comms integration exists. |
| **Active Broadcasts** | ❌ Rejected — out of scope | Broadcast/vision-mixing monitoring is a TV production control room concern, a different audience from stadium safety/operations. No broadcast data model exists in this codebase. Including it dilutes operational density with irrelevant signal. |
| **Stadium Health (physical infrastructure: HVAC, power, structural)** | ❌ Deferred | Distinct from Platform Health (software). No sensor data model currently exists. Don't fabricate a card for data that doesn't exist yet — note as a Phase 2 widget once facility IoT is wired in. |

This is the "think like an Operations Director" filter your brief asked for: **every included widget maps to data that exists or is trivially derivable; every excluded widget either duplicates something else or has no real data behind it yet.**

---

## 3. Widgets to Merge

| Merge | Into | Mechanism |
| --- | --- | --- |
| Crowd Intelligence + Entry Gates Throughput | **Crowd & Gates Intelligence** | Single widget, `Density / Flow / Table` view toggle (same tab pattern already used inside Crowd Intelligence today) |
| Emergency Queue + Recent Events + Live Timeline | **Critical Alerts & Emergency Queue** | Pinned "Active Emergencies" section (top) + scrollable general feed (below) + `Feed / Timeline` tab |
| Camera Status | **Platform Health** (status row) + **Digital Twin** (map overlay) | One line item + one map layer, not a card |
| Medical Operations + Security Operations | **Resource Deployment** | Two labeled rows/sections inside one widget, grouped by unit type |
| Parking + Transport + Weather (as standalone concepts) | **Live Operations Summary** | Stat chips in the persistent strip |

**Why this matters operationally:** every merge above removes a place where an operator has to reconcile two visual representations of one truth. In a live incident, the cost of "which card is current" doubt is measured in seconds an operator doesn't have.

---

## 4. Widgets to Remove

| Widget | Removed as standalone | Replacement |
| --- | --- | --- |
| Entry Gates Throughput (as separate card) | ✅ | Merged into Crowd & Gates Intelligence |
| System Health accordion (in current collapsible form) | ✅ | Rebuilt as permanent Platform Health strip |
| Active Broadcasts | ✅ (entirely, not just merged) | None — out of scope for this product surface |
| Communication Status | ✅ (deferred, not built) | Revisit when a real comms data source exists |
| Stadium Health (physical infra) | ✅ (deferred, not built) | Revisit when facility IoT sensors are integrated |
| Standalone Camera grid card | ✅ | One Platform Health row + Digital Twin overlay layer |
| Standalone Parking / Transport / Weather cards | ✅ | Stat chips in Live Operations Summary |

Nothing here is removed to simplify the product — each removal is because the information has a better home, or doesn't exist yet.

---

## 5. Widget Sizes (Large / Medium / Small)

| Tier | Widget | Size class | Rationale |
| --- | --- | --- | --- |
| **XL (canvas)** | Digital Twin | Full-height primary canvas, ~66–70% row width | Spatial situational awareness needs the most pixels of any widget in the product — it is the map on which every other signal gets plotted. |
| **Large** | AI Operations Copilot | Tall, ~30–34% row width, matched height to Digital Twin | Second-most-important surface; needs vertical room for recommendation queue + reasoning pane + decision timeline footer. |
| **Medium-Large** | Critical Alerts & Emergency Queue | ~40–42% of secondary row, taller than its row-mates | Text-dense (title, location, timestamp, description, status, timer) — needs width to avoid truncation, and height to show 4–6 items without scrolling. |
| **Medium** | Crowd & Gates Intelligence | ~32–35% of secondary row | Chart/table content scales with gate count; doesn't need alerts-level width. |
| **Small-Medium** | Resource Deployment | ~24–28% of secondary row | Compact status rows (unit type, count, status dot) — list density is naturally narrow. |
| **Small (strip)** | Platform Health | Full width, fixed low height (~56–64px), no expansion | Ambient, always-on, glanceable — deliberately small so it never competes with primary content, but never hidden either. |
| **Small (strip)** | Live Operations Summary | Full width, fixed low height (~56–64px) | Same rationale — a fact strip, not a card. |

---

## 6. Bento Grid Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Page Header  (title · Export Report · Broadcast Alert)                   │
├──────────────────────────────────────────────────────────────────────────┤
│  ● PLATFORM HEALTH   Platform ● Database ● API ● WebSocket ● Maps ● AI ● Storage │  ← Strip 1 (persistent, non-collapsible)
├──────────────────────────────────────────────────────────────────────────┤
│  LIVE OPERATIONS SUMMARY  Match · Venue · Attendance · Weather · Gates    │  ← Strip 2 (extended TelemetryBar)
│                            Open · Security · Medical · Local Time         │
├────────────────────────────────────────────────┬─────────────────────────┤
│                                                  │                         │
│                                                  │  AI OPERATIONS COPILOT  │
│                                                  │  ───────────────────── │
│               DIGITAL TWIN                      │  Recommendation queue   │
│         (Map · Layers · Floors · Zoom)          │  Confidence · Risk      │
│                                                  │  Explain Why (expand)   │
│         ~68% width · tallest card                │  Approve / Reject /     │
│                                                  │  Escalate               │
│                                                  │  ───────────────────── │
│                                                  │  Decision Timeline      │
│                                                  │  ~32% width · same ht   │
├───────────────────────────────┬──────────────────┼─────────────────────────┤
│  CRITICAL ALERTS &             │  CROWD & GATES    │  RESOURCE DEPLOYMENT   │
│  EMERGENCY QUEUE               │  INTELLIGENCE     │  ──────────────────── │
│  ── Active Emergencies (2) ──  │  [Chart|Table]    │  Security   ● 4 active │
│  🔴 Medical — 02:14 elapsed    │  toggle            │  Medical    ● 2 active │
│  🟠 Gate C Congestion — 4m     │                    │  Maintenance ○ 1 idle  │
│  ── Feed | Timeline tab ──     │  gate bars / table │                        │
│  ~42% width                    │  ~34% width        │  ~24% width            │
└───────────────────────────────┴──────────────────┴─────────────────────────┘
```

This is the "Observe → Detect → Decide → Act" sequence made physical:

- **Observe** — the two persistent strips at the top, before any card.
- **Detect** — Digital Twin (spatial) + Critical Alerts/Crowd & Gates (event + density).
- **Decide** — AI Operations Copilot, positioned beside the map so detection and decision share one eye-sweep.
- **Act** — Approve/Reject/Escalate inside the Copilot, and Resource Deployment showing who is already acting.

---

## 7. Responsive Grid Structure

**Recommendation: keep the 12-column grid. Do not move to 24.**

The codebase already uses `grid-cols-12` throughout (`AdminDashboard.tsx`). Every ratio this layout needs — 8/4, 5/4/3, 7/5 — divides cleanly into twelfths. A 24-column grid would only be justified if the design needed asymmetric ratios finer than ~8% increments (e.g., 29% vs 33%), which nothing here requires. Doubling the column count adds maintenance overhead (breakpoint math, span arithmetic) without adding real layout resolution. **12 columns is the correct, defensible choice — not the default one.**

What *does* need to change is that the current layout uses `flex flex-col` columns (implicit, content-driven height) instead of true CSS Grid rows with explicit row-spans. That's why today's cards default to uniform-ish heights regardless of content priority. The fix is structural, not a column-count change:

| Breakpoint | Behavior |
| --- | --- |
| **≥1280px (xl / command-room displays)** | Full Bento: Strip 1, Strip 2, Row 1 = Digital Twin (`col-span-8`, `row-span-2`) + AI Copilot (`col-span-4`, `row-span-2`, height matched to Digital Twin), Row 2 = Critical Alerts (`col-span-5`) + Crowd & Gates (`col-span-4`) + Resource Deployment (`col-span-3`). |
| **1024–1279px (lg / tablet-landscape control tablets)** | Digital Twin drops to `col-span-7`, AI Copilot to `col-span-5` (still side-by-side — this pairing must never stack, it's the core Detect→Decide sequence). Row 2 becomes `col-span-6 / col-span-6` with Resource Deployment moving below full-width (still visible, no scroll-hunting). |
| **768–1023px (md / secondary monitor, portrait tablet)** | Digital Twin and AI Copilot stack (`col-span-12` each), Digital Twin first. Row 2 widgets stack `col-span-12`, ordered Alerts → Crowd & Gates → Resource Deployment. Strips remain full-width and persistent regardless of breakpoint. |
| **<768px (mobile — break-glass access only)** | Single column, same priority order as md. Platform Health strip compresses to icon-only dots with a tap-for-label affordance (still never hidden behind a menu). |

The two strips are **never part of the column system's stacking behavior** — they are always full-width, always first, at every breakpoint. That's what makes them "persistent" rather than "responsive."

---

## 8. Visual Hierarchy

1. **Level 0 — Ambient (always true, always visible):** Platform Health, Live Operations Summary. Small type (11–12px), low-saturation status dots, no card chrome (or minimal chrome) so they read as "background truth," not content to analyze.
2. **Level 1 — Primary canvas:** Digital Twin. Largest type for its own header (20px, current `font-display` treatment is correct), most visual weight, map fills essentially all available card space with overlay controls rather than padding-heavy chrome.
3. **Level 2 — Decision surface:** AI Operations Copilot. Second-largest header weight (14–16px), classification badges keep their current color-coded treatment (already correct), but gains a visually distinct "reasoning" affordance (e.g., a subordinate expand row, not another modal) so Decide doesn't require a context switch.
4. **Level 3 — Supporting detail:** Critical Alerts, Crowd & Gates, Resource Deployment. Standard 13–14px card headers, consistent with current typography scale — these are "drill in when something above prompts you to," not "scan first."

**Rule:** nothing at Level 3 should visually compete with Level 1/2 in size, saturation, or motion. Today, Crowd Intelligence and Entry Gates use the same card size and shadow treatment as the AI Copilot — that visual equality is the core of the "generic SaaS" feeling. Restoring a real size gradient is what fixes it.

---

## 9. Information Architecture

**Principle:** organize by *operational question*, not by *data source*.

| Operator question | Answered by |
| --- | --- |
| "Is the system itself trustworthy right now?" | Platform Health |
| "What's the overall state of the event?" | Live Operations Summary |
| "Where is everything, physically, right now?" | Digital Twin |
| "What does the system think I should do?" | AI Operations Copilot |
| "What's actively wrong, and for how long?" | Critical Alerts & Emergency Queue |
| "How congested are entry points?" | Crowd & Gates Intelligence |
| "Who do I already have in the field?" | Resource Deployment |

This is deliberately **not** organized by feature team or data model (which is how the current widget set grew — one card per API concept). An Operations Director doesn't think "show me the gates table"; they think "are we about to have a bottleneck," which pulls from gates *and* crowd density *and* AI risk scoring at once. The IA above is a starting point for that convergence, and each widget explicitly cross-references the others in its content (e.g., an AI recommendation card can cite a specific gate from Crowd & Gates, a specific unit from Resource Deployment).

---

## 10. Spacing Rules

Keep the existing token scale (the brief explicitly protects design tokens) — the fix is *application*, not new values.

- **Strip padding:** 12–16px vertical, matches current `TelemetryBar` (`py-3`) — do not increase, strips must stay visually "thin."
- **Card padding:** 20–24px (current `p-5`/`p-6` usage is correct) for content cards; Platform Health and Live Ops Summary are exempt — they use strip padding, not card padding, since they are not cards.
- **Grid gutters:** keep `gap-x-5 gap-y-6` (20px/24px) between cards — do not tighten. The current gap size is correct; the current *card size uniformity* was the problem, not the spacing between them.
- **Inter-strip spacing:** 8–12px between Platform Health and Live Operations Summary (they read as one "ambient zone," so they sit closer to each other than to the card grid below).
- **Zone spacing:** 24px between the strip zone and the primary card row, and between the primary row and the secondary row — this gap is what visually separates "ambient truth" / "primary decision-making" / "supporting detail" into three distinct bands an eye can jump between.
- **Internal card rhythm:** header height stays fixed per tier (60px for list-style cards, as already implemented in `CriticalAlertsWidget`/`EntryGatesWidget`) so headers align horizontally across cards in the same row — this alignment is currently inconsistent (`AIOperationsWidget` and `CrowdIntelligenceWidget` use `mb-4`/`mb-5` ad hoc rather than a shared header height).

---

## 11. Card Size Rules

| Rule | Value | Why |
| --- | --- | --- |
| Minimum card height (any Level 3 card) | 320–360px | Below this, list/chart content clips awkwardly; above it without content, it's dead space. |
| Digital Twin / AI Copilot height parity | Must match exactly, row-spanned together | They are read as one unit (Detect + Decide); mismatched heights break that pairing visually. |
| Strip height | Fixed, 56–64px, never variable | A strip that resizes based on content defeats its purpose as a stable ambient reference point. |
| Max card width (any single card) | ~70% of canvas (Digital Twin only) | No other widget should ever approach map-level width — that would re-flatten the hierarchy this document just established. |
| No card at exactly 50/50 or equal thirds | Enforced | Equal widths are the visual signature of "nothing here is more important than anything else" — the opposite of a command center. Every row must express at least one clear width-majority. |
| Border radius, shadow, border color | Unchanged (`rounded-[16px]`, current `border-[#E2E8F0]`, current shadow token) | Protected — this is visual identity, not layout. |

---

## 12. Dashboard Scan Flow

Designed as an **F-pattern with a locked top band**, matching how ATC and Datadog operators actually scan:

1. **Top band (locked, sub-1-second read):** Platform Health dots, left to right — operator confirms "system is trustworthy" before looking at anything else.
2. **Second band (locked, ~1 second):** Live Operations Summary — match state, attendance, gates, security/medical posture. This is the "what's the general shape of tonight" read.
3. **Primary sweep (left → right, ~2 seconds):** Digital Twin (where), then AI Copilot (what to do about it) — because they're adjacent, this is a single eye movement, not a scroll-and-return.
4. **Secondary sweep (left → right, on demand, not forced):** Critical Alerts (most urgent, leftmost and widest of the three) → Crowd & Gates → Resource Deployment (narrowest, rightmost — "who's already on it" is the last confirmation, not the first question).

Total time to full situational awareness: **under 5 seconds** for the two locked bands + primary sweep, with the secondary row available for the next 5–10 seconds of deeper triage — matching the brief's explicit target.

---

## 13. Why Each Decision Improves Operator Efficiency

- **Un-collapsing Platform Health** removes the single biggest trust risk in the current build: an operator should never have to click to find out if the data they're looking at is live. A silently-stale WebSocket feed is more dangerous than an obviously-broken one.
- **Placing AI Copilot beside, not below, Digital Twin** cuts the physical distance between "what am I seeing" and "what should I do" to a single eye movement — every scroll is a moment where a fast-moving situation (crowd crush, medical event) can change before the operator has even seen the recommendation.
- **Merging Crowd Intelligence + Entry Gates** removes a redundant read of one dataset shown two ways — in a live incident, two cards that could theoretically say slightly different things about the same gate is a trust hazard, not just a density problem.
- **Pinning an Emergency Queue inside Critical Alerts** (rather than a separate card) means there is exactly one place "what's on fire right now" can be, with a visual separation (pinned top section) instead of a mental one — no operator has to remember to check a second widget for the same category of information.
- **Resource Deployment as its own compact widget** answers a question the current build cannot answer at all today: "is anyone already handling this?" Without it, an operator might redundantly dispatch a unit that's already en route — this widget directly prevents a real, costly operational error.
- **Rejecting Active Broadcasts, Communication Status, and Stadium Health** keeps the canvas at the information density a real operator can sustain for a 90-minute match or a multi-day tournament — every widget included has to earn its cost in attention, and these three either have no real data behind them yet or belong to a different control room entirely.
- **A real width gradient (68/32, then 42/34/24) instead of equal columns** means the *layout itself* tells the operator what matters before they've read a single word — which is what "feels like a command center, not a SaaS dashboard" actually means in practice.

---

## 14. Future-Ready Layout for Maps, AI, WebSockets & Live Data

- **Digital Twin canvas is reserved at ~68% width specifically so additional map layers don't force a redesign.** The existing `Physical / Thermal / Crowd Flow` layer toggle is the correct mechanism — heatmaps, camera-overlay pins, security-patrol markers, medical-team positions, parking occupancy shading, crowd-density contours, incident markers, gate-status pins, weather overlays, and emergency-route lines are all *additional layer toggle entries*, not new widgets or new canvas space. The width allocation here is what makes that scalable without ever needing to "make room" later.
- **AI Operations Copilot's vertical space is reserved for a 3-zone internal structure** (recommendation queue → expandable reasoning/"Explain Why" pane → decision timeline footer) so that Risk Score, Escalation, and Operator Notes can be added as new fields *within* existing zones rather than requiring new widget real estate. Escalation, specifically, should live as a third action alongside Approve/Reject (not a separate flow), and Operator Notes as an inline annotation on any timeline entry.
- **Platform Health's row structure (Platform, Database, API, WebSocket, Maps, AI, Storage) is deliberately one row per live-data dependency.** When a new live subsystem is added (e.g., a computer-vision inference service, an IoT sensor gateway), it gets one more status dot in this exact strip — the strip's format doesn't change, only its row count, which is why it must never be allowed to grow into an accordion again.
- **Resource Deployment's list structure (unit type → count → status) directly extends to Computer Vision and IoT** once those produce discrete "unit-like" entities (a camera cluster, a sensor zone) — same row pattern, same widget, no redesign required.
- **The 12-column grid with row-span-based Bento cards (not flex-col stacking)** is the structural choice that makes all of the above possible without future layout rewrites: because sizing is expressed as grid spans rather than intrinsic content height, adding content to any widget (more map layers, more AI fields, more health rows) doesn't cascade into resizing its neighbors unpredictably — each card's grid footprint is a deliberate, fixed decision, exactly as designed in §6 and §11.

---

## Confirmation of Constraints Honored

- Header, Sidebar, Utility Panel: **not touched.**
- Theme, color system, typography, design tokens: **not touched** — all sizing/spacing recommendations reuse existing token values (`rounded-[16px]`, existing border/shadow classes, existing gap scale).
- No equal-width cards anywhere in the final grid.
- No widget included without a stated data source or explicit deferral reason.
