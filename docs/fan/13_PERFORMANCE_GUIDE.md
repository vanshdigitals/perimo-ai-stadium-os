# 13 · Performance Guide — Fan Experience

Budgets (mobile, mid-tier device / 4G): **LCP < 2.5s, CLS < 0.1, INP < 200ms, initial route JS < 200KB gz.** Lighthouse mobile ≥ 90.

## Route splitting
- Every `/fan/*` screen `React.lazy` + `Suspense` (already the router norm). One feature = one chunk.
- Shared fan primitives in a small `features/fan/shared` chunk. Avoid importing heavy libs (map, video) into the shell.

## Images
- Explicit `width`/`height` (or aspect-ratio box) on **every** `<img>` → zero CLS.
- `loading="lazy"` + `decoding="async"` except above-the-fold (ticket/home hero: `eager` + `fetchPriority="high"`).
- `thumbnail_url` in lists, `full_url` on open; skeleton placeholder; `onError` → branded gradient block (layout never breaks).
- Reuse existing `stadium-light/dark.png`; serve remote media pre-sized; prefer AVIF/WebP where available.

## Video (strict)
- **Never embed large video.** Poster thumbnail + play affordance → lazy-mount a single lightweight player (`streaming_url`, HLS/MP4).
- One video mounted at a time; pause + unmount off-screen; no autoplay; respect reduced-motion + data-saver.

## Lazy loading & virtualization
- Long lists (food, store, media, notifications): virtualize (windowing) or paginate; render skeleton rows.
- Intersection-observer for below-fold sections and media.

## Caching & prefetch
- SWR cache (`09_STATE_MANAGEMENT`): instant remount, background revalidate.
- On Home idle, prefetch the two most likely routes (Ticket, Map) chunk + data.
- Service worker precache app shell; SWR for read models; cache-first for static/media thumbnails.

## Realtime efficiency
- One WS connection app-wide (`FanRealtimeProvider`); patch caches instead of refetch.
- Ref-counted room subscriptions; unsubscribe on screen unmount; throttle high-frequency events (crowd) to ~1/2s.

## React hygiene
- Memoize list rows (`React.memo`), stable callbacks (`useCallback`), derived data via `useMemo`.
- Abort in-flight fetches on unmount (API client supports `signal`); no state updates after unmount.
- Avoid re-render storms from `AppContext` — select narrowly / split providers if needed.

## Measurement
- CI: bundle-size check per chunk; Lighthouse CI on the fan routes (budgets above).
- Track LCP/CLS/INP via web-vitals in dev; flag regressions in `11_QA_CHECKLIST`.
