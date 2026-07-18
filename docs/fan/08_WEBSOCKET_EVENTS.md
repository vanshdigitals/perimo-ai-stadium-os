# 08 · WebSocket Events — Fan realtime

**Reuse the existing gateway.** `platform/websocket/gateway.py` already provides: authenticated `/v1/ws` (token in query), a `ConnectionRegistry` with room `subscribe`/`unsubscribe`, `ping`→`pong`, dead-connection cleanup, and an **event-bus fan-out** mapping `event_type` prefix → room (`incident|crowd|resource|transport|twin|notification|ai|system`). Fan work **extends the room map**, it does not build a new gateway.

## Connection lifecycle (client)
```
1. connect  wss://<api>/v1/ws?token=<access_jwt>
2. on open  → send { action:'subscribe', rooms:[...] }   (rooms below)
3. server   → { ack:'subscribed', rooms }
4. server   → { type:'<event>', payload:{...}, timestamp }   (pushes)
5. keepalive→ send { action:'ping' } every 25s → { ack:'pong' }
6. close/err→ exponential backoff reconnect (1s→2s→4s→…→30s cap), re-subscribe on reconnect
```
Auth failure closes with `1008`. On token refresh, reconnect with the new token.

## Rooms & events the Fan app subscribes to
| Room | Subscribe when | Events | Payload | Screen effect |
|---|---|---|---|---|
| `match:{id}` | Home (live match), Match Center | `match.score`, `match.event`, `match.status` | `{matchId,home,away,minute}` / event / status | patch scoreboard + timeline |
| `crowd` | Home, Navigation | `crowd.level_changed` | `{zone,level}` | crowd chip + map overlay |
| `gates` | Home, Navigation | `gate.status` | `{gate,status}` | gate chip / route warning |
| `transport` | Home, Transport | `transport.update` | `{mode,eta,status}` | transport chip |
| `emergency` | always (Home/Map/Match) | `emergency.alert` | `{severity,message,zone}` | full-screen alert widget |
| `user:{id}` | always (authed) | `notification.new`, `order.status` | notif / `{orderId,status}` | bell badge + order stepper |

## Backend additions required
1. Extend `_EVENT_ROOM_MAP` in `gateway.py` with `match`, `gate`, and per-user routing for `user:{id}` (registry must key user-scoped rooms; add `subscribe` validation that a client may only join its own `user:{id}` and `match:{id}` of a match it holds a ticket for).
2. Fan/match/order/emergency **services publish** `DomainEvent(event_type="match.score"|"order.status"|"emergency.alert"|...)` — the fan-out already forwards them.
3. Presence/heartbeat: `ping/pong` exists; add optional `presence` broadcast on `user:{id}` if needed (P3).

## Client provider
`features/fan/shared/FanRealtimeProvider` (single socket for the whole fan app):
- opens one connection, tracks desired rooms per mounted screen (ref-counted subscribe/unsubscribe),
- exposes `useRoomEvent(event, handler)`,
- patches the `useApiQuery` cache on push (no refetch),
- **degrades gracefully:** if WS never connects, screens fall back to REST polling intervals (match 10s, crowd/transport 30s).

## Reliability rules
- Idempotent handlers (events may arrive twice after reconnect).
- Never trust WS for auth-sensitive facts (ticket validity is REST + server-validated).
- Emergency alerts are also mirrored via REST/notification so a missed socket message is not fatal.
