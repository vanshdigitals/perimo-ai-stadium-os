# 04 · Component Library — Fan Experience

**Reuse-first rule:** before building, check `components/` and `components/widgets/`. The admin panel already ships `KPICard`, `StatusPill`, `DataTable`, `Timeline`, `EmptyState`, `ErrorState`, `LoadingSkeleton` (`KPISkeleton/RowsSkeleton/ChartSkeleton`), charts, `FilterBar`, `Toast`. Fan components live under `features/fan/**/components` and `features/fan/shared`.

## Legend
**R** = reuse existing · **A** = adapt existing · **N** = new (fan-specific)

## Shell & navigation
| Component | Status | Source / notes |
|---|---|---|
| `FanLayout` | **R** | `components/layouts/FanLayout.tsx` (bottom bar + sidebar) |
| `BottomBar` | **R** | inside FanLayout |
| `FanScreen` | **N** | page wrapper: header slot, scroll, safe-area, loading/error boundary |
| `EmergencyFAB` | **N** | persistent floating action → `/fan/emergency` |
| `Toast` | **R** | `components/ui/Toast.tsx` + `AppContext.toast()` |

## Primitives (reuse admin/design-system)
| Component | Status | Notes |
|---|---|---|
| Button (primary/secondary/ghost) | **R** | existing button styles / `HeaderActionButton` pattern |
| `StatusPill` / `StatusChip` | **R/A** | reuse `StatusPill`; `StatusChip` = compact live variant for Home |
| Input / Select / `FilterBar` | **R** | `components/widgets/FilterBar.tsx` |
| `Skeleton` (block/row/card) | **R** | `components/widgets/LoadingSkeleton.tsx` |
| `EmptyState` / `ErrorState` | **R** | `components/widgets/` |
| Modal / Drawer / BottomSheet | **A/N** | `BottomSheet` new (mobile-first), reuse overlay patterns from `OverlayContext` |

## Fan-specific (new)
| Component | Screen | Key props |
|---|---|---|
| `TicketCard` | Ticket, Home preview | match, seat, gate, status, variant('full'\|'preview') |
| `QRCode` | Ticket | token, size — render from signed token, offline-safe |
| `CountdownTimer` | Ticket, Match | targetTime, onElapsed |
| `Scoreboard` | Match | home, away, score, minute, status |
| `MatchTimeline` | Match | events[] (minute,type,team,player) — adapt `Timeline` |
| `Lineup` | Match | formation, players[] |
| `StatBar` | Match | label, homeValue, awayValue |
| `StadiumMap` | Navigation | pois[], route?, floor, crowdOverlay? — MapLibre/SVG (see below) |
| `RouteSheet` | Navigation | route(steps,distance,eta,stepFree), onStepFreeToggle |
| `FloorSwitcher` | Navigation | floors[], active |
| `POICard` / `POIDetailSheet` | Explore/Nav | poi(name,category,distance,floor) |
| `CategoryChips` | Explore/Food | categories[], active, onChange |
| `VendorCard` | Food | vendor(name,cuisine,rating,waitMinutes,image,dietary[]) |
| `DietaryFilter` | Food | selected[], onToggle |
| `OrderStatusStepper` | Food | status(placed→preparing→ready→collected) |
| `ProductCard` / `WishlistButton` | Store | product(name,price,image,sizes[]) |
| `MediaGallery` / `MediaCard` | Media | items[] (thumbnailUrl, fullUrl, type) — lazy |
| `VideoPreview` / `Lightbox` | Media | poster, streamingUrl — poster-first, lazy player |
| `EmergencyAction` | Emergency | type, icon, onConfirm — ≥96px target, 2-step confirm |
| `ExitGuide` | Emergency | nearestExit, miniMap |
| `RecommendationCard` | Home/AI | title, reason, action, "AI" label |
| `QuickActionTile` | Home | icon, label, path |
| `ScheduleTimeline` | Home | items[] |
| `AssistantSheet` | AI | messages[], suggestedPrompts[], onSend, voicePlaceholder |
| `WeatherPill` / `CrowdChip` / `TransportChip` | Home | live value + tone |

## Component rules
- Presentational + container split: components take data props; feature hooks (`useHome`, `useTicket`…) do fetching.
- Every list component: `loading`, `empty`, `error` states built-in.
- Every interactive element: `focus-visible` ring, `aria-label`, keyboard operable, reduced-motion aware.
- No business logic inside components; no hardcoded data (all via `api.ts`/hooks).
