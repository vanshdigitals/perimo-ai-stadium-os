# 11 · QA Checklist — Fan Experience

Run per batch and again before handoff. Gate = must pass to merge.

## Build & types (gate)
- [ ] `tsc -b --noEmit` → 0 errors
- [ ] `vite build` passes, no new warnings
- [ ] `pytest` (backend) green; every `/v1/fan/*` has a contract test
- [ ] no unused imports / dead components / `console.*` left in shipped code

## Every screen — the four+ states
- [ ] **Loading** shows skeletons (no blank flash, no spinner-on-content)
- [ ] **Empty** shows icon + reason + action
- [ ] **Error** shows human message (from `ApiError`) + Retry that recovers
- [ ] **Offline** shows cached data + banner; recovers on reconnect
- [ ] **Success** matches the UX spec

## Interactions (no dead clicks)
- [ ] every button/link/tab/chip/filter/toggle does something (navigate / mutate / toast / open sheet)
- [ ] forms validate client + server; invalid state visible; submit disabled until valid
- [ ] bottom bar + FAB reachable on every screen; back affordance present
- [ ] deep links resolve (`/fan/ticket`, `/fan/map`, `/fan/emergency`, `/fan/match`)

## Realtime
- [ ] WS connects with token; reconnects with backoff; re-subscribes rooms
- [ ] match score / order status / emergency alert update live without refresh
- [ ] duplicate events are idempotent; WS-down falls back to polling
- [ ] user can only join own `user:{id}` / permitted `match:{id}`

## Auth & security
- [ ] `/fan/*` requires fan role; other roles redirected
- [ ] silent refresh on 401; hard-fail → login
- [ ] no Gemini/Maps key in the built bundle (grep `dist/`)
- [ ] server rejects unknown fields (422), out-of-range values, foreign `user_id`
- [ ] ticket QR validated server-side; rate limits on writes/assistant

## Data integrity
- [ ] no mock/hardcoded data in shipped screens (all via `api.ts`)
- [ ] money/units formatted consistently; timestamps localized
- [ ] emergency never optimistic; ticket always renders (even offline)

## Responsive (design each breakpoint)
- [ ] mobile (375) · tablet (768) · desktop (1280) · ultrawide — no overflow, no compression
- [ ] safe-area insets on mobile (notch, home bar); bottom bar not overlapped

## Cross-cutting
- [ ] light + dark both correct
- [ ] accessibility checklist (`12`) passes
- [ ] performance checklist (`13`) passes
- [ ] no layout shift on image load (CLS)
