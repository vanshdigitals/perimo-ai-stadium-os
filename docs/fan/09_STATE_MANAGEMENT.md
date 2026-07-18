# 09 · State Management — Fan Experience

**Reuse-first.** No new state library. The app already has: `platform/api/client.ts` (fetch seam), `hooks/data/useApiQuery.ts` (server-state hook: loading/error/data/refetch + abort), `contexts/AppContext.tsx` (theme, language, toasts, notifications), `tokenStore` (auth). Build on these.

## State taxonomy
| Kind | Owner | Mechanism |
|---|---|---|
| **Server state** (home, match, ticket, food…) | feature hooks (`useHome`, `useTicket`…) | `useApiQuery` + a small keyed cache |
| **Realtime state** (score, crowd, order status, emergency) | `FanRealtimeProvider` | WS push → patch cache |
| **UI/session** (theme, language, toasts) | `AppContext` | reused as-is |
| **Auth** (tokens) | `tokenStore` + API client | reused |
| **Persistent local** (cached ticket, offline snapshot, wishlist) | `localStorage` | see Offline |

## Caching
- Add a tiny module cache in the `useApiQuery` layer keyed by URL: return cached data instantly on remount, revalidate in background (**stale-while-revalidate**). TTLs: home 30s, vendors/products 5min, pois 10min, ticket 5min (but always render cached).
- Invalidate on mutation (place order → invalidate `orders`, `home`).

## Optimistic updates
- **Wishlist toggle:** flip UI immediately, POST/DELETE `favorites`, revert + toast on failure.
- **Mark notification read:** optimistic, reconcile on response.
- **Place order:** optimistic "placed" card, replace with server order; WS `order.status` advances it.
- Never optimistic for **emergency** (must confirm real dispatch) or **ticket validity**.

## Offline cache & hydration
- On successful fetch of **ticket** and **home**, write payload to `localStorage` (`fan.ticket`, `fan.home.snapshot`).
- On boot: hydrate screens from `localStorage` first (instant paint), then revalidate.
- **Write queue:** offline `order`/`favorite`/`notification-read` mutations are enqueued (`fan.outbox`) and replayed on reconnect; emergency is never silently queued — it attempts immediately and surfaces failure.
- Show an `offline` banner (from `navigator.onLine` + failed-fetch signal); clear on reconnect.

## Realtime → cache patching
`FanRealtimeProvider` holds no screen state; it dispatches events that feature hooks subscribe to via `useRoomEvent`, which mutate the relevant cache entry (e.g. `match.score` patches `matches/{id}` cache). This keeps one source of truth per query.

## Rules
- No global mutable store beyond `AppContext`. No prop-drilling of server data — use the feature hook.
- Every hook returns `{ data, loading, error, refetch }`; screens render the four states explicitly.
- No business logic in components; no fetching in components.
