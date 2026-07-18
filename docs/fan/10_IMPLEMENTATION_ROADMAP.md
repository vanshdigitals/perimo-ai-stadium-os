# 10 · Implementation Roadmap — Fan Experience

Small, independently-testable batches. Each batch: **build → typecheck (`tsc -b`) → `vite build` → browser-verify the touched screens → commit**. Frontend batches ship against the existing fixture store; Postgres is deferred to Batch P (needs a real DB). Reuse everything in `04_COMPONENT_LIBRARY`.

| # | Batch | Scope | Depends on | Independently testable? |
|---|---|---|---|---|
| **0** | **Foundation** | `features/fan/shared` (`FanScreen`, `EmergencyFAB`, `BottomSheet`, skeletons), fan routes stub (`/fan/ticket`, `/fan/store`, `/fan/ai`, etc.) wired to placeholders, `features/fan/*/api.ts` typed clients | existing FanLayout, api client | ✅ routes resolve, shells render |
| **1** | **Home** | `useHome` + Home screen (all cards) against `GET /v1/fan/home` | Batch 0, backend Home (Batch B1) | ✅ |
| **2** | **Digital Ticket** | Ticket screen + `TicketCard`/`QRCode`/`Countdown`, offline cache | Batch 0, B1 | ✅ |
| **3** | **Navigation + Explore** | adapt existing `/fan/map`, `RouteSheet`, POIs, step-free toggle | routing kernel | ✅ |
| **4** | **Match Center** | Scoreboard/Timeline/Lineups/Stats + WS `match:{id}` | Realtime (Batch C) | ✅ |
| **5** | **Food** | vendors/filters/order + `order.status` WS | B, C | ✅ |
| **6** | **Emergency** | actions, 2-step confirm, exit guide, `emergency` room | B, C | ✅ |
| **7** | **AI Companion** | `AssistantSheet` → `POST /assistant/ask` (server Gemini) | ai_manager (exists) | ✅ |
| **8** | **Store · Media · Transport · Parking** | remaining P2 screens, lazy media | B | ✅ |
| **9** | **Profile · Settings · Notifications** | reuse AppContext theme/lang; notifications bell + feed | B | ✅ |
| **B1–Bn** | **Backend fan domains (FastAPI)** | `domains/fan/*` services+routers returning `07_API_CONTRACTS` from fixture store; pytest per sub-domain | existing backend | ✅ (curl/pytest) |
| **C** | **Realtime** | extend gateway room map; `FanRealtimeProvider`; publish match/order/emergency events | gateway (exists) | ✅ |
| **P** | **Persistence** | SQLAlchemy models + Alembic + `SqlDocumentStore`; swap fixtures→Postgres behind repositories | **a provisioned Postgres (`DATABASE_URL`) — prerequisite not yet met** | ✅ once DB exists |
| **E** | **PWA / Offline hardening** | service worker, offline ticket, media player, install prompt | 1–8 | ✅ |
| **Q** | **QA / A11y / Perf pass** | `11`, `12`, `13` checklists | all | ✅ |

**Suggested order:** 0 → B1 → 1 → 2 → 3 → C → 4 → 5 → 6 → 7 → 8/9 → E → (P when DB ready) → Q.
Ship value early: Home + Ticket + Navigation (0–3) is a usable MVP before realtime and persistence.
