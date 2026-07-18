# 01 · Product Overview — PERIMO Fan Experience

> Handoff spec. Companion docs: `02_INFORMATION_ARCHITECTURE` … `13_PERFORMANCE_GUIDE`, plus the parent `docs/FAN_EXPERIENCE_ARCHITECTURE.md`. Reuse the existing PERIMO design system and FastAPI backend — do not redesign.

## Vision
The flagship consumer product of PERIMO: an AI stadium companion that carries a fan from ticket to seat to departure — wayfinding, food, live match, safety — in one calm, premium, mobile-first PWA. Not a dashboard.

## Goals
1. **Reduce match-day stress** — every "where / when / how long" answered in ≤2 taps.
2. **One source of truth** — the fan sees the same live crowd/gate/transport data the operators do.
3. **Safety within reach** — emergency and exit guidance always one tap away.
4. **Accessible & global** — step-free routing, 20+ languages, WCAG AA, offline-tolerant.

## Problem
Today fans juggle 4+ apps (ticket, parking, food, maps), none of which know the live state of the venue. Information is fragmented, stale, and inaccessible under stress.

## Target users
| Persona | Need | Priority |
|---|---|---|
| **General fan** | Get in, find seat/food/toilets, follow match, get out | P0 |
| **Family / accessibility** | Step-free routes, sensory rooms, lost-child, family zones | P0 |
| **Visiting / international** | Language, transport, unfamiliar-venue navigation | P1 |
| **Power fan** | Live stats, highlights, rewards | P2 |

## Core user journey (7 phases)
`Pre-event → Arrival → Entry & navigation → Match → Halftime → Post-match → Departure` (detailed in `02_INFORMATION_ARCHITECTURE §user-flows`). Stress peaks at **Entry** and **Departure** — the app must be fastest there.

## Primary scenarios
1. **"Get me to my seat."** Ticket → gate → step-free route → ETA, crowd-aware.
2. **"I'm hungry at halftime."** Nearest low-wait vendor matching dietary filter → order → track.
3. **"Something's wrong."** Emergency tab → medical / lost child / security / nearest exit.
4. **"How's the match?"** Live scoreboard, timeline, key moments — without leaving the venue context.
5. **"How do I get home?"** Live transport/parking status and departure-flow guidance.

## Success metrics
| Metric | Target |
|---|---|
| Time-to-seat after entry | < 5 min guided |
| Home → any core action | ≤ 2 taps |
| Live data staleness | < 2 s (WS) / < 30 s (poll fallback) |
| Ticket available offline | 100% |
| Lighthouse (mobile) PWA / A11y | ≥ 90 |
| Crash-free sessions | ≥ 99.5% |

## Non-goals
Payments/checkout beyond order placeholder; social feeds; ticket *purchase* (assumed issued upstream); native app (PWA only).
