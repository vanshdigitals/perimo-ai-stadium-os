# 06 · Database Schema — Fan domain (SQLAlchemy target)

**Status:** target design. The backend runs on the in-memory `DocumentStore` today; these models land in **Roadmap Batch P** behind a `SqlDocumentStore` implementing the same interface, so services/contracts are unaffected. **Do not implement until `DATABASE_URL` (a real Postgres) exists.**

## Conventions
- SQLAlchemy 2.0 declarative (`Mapped[...]`, `mapped_column`). UUID PKs (`uuid4`), `created_at`/`updated_at` timestamptz defaults. snake_case tables. Alembic autogenerate + reviewed migrations. FKs indexed; enums as native PG enums.

## Enums
```
match_status   = enum('scheduled','live','halftime','finished')
ticket_status  = enum('valid','used','expired','void')
order_status   = enum('placed','preparing','ready','collected','cancelled')
event_type     = enum('goal','yellow','red','sub','var','kickoff','fulltime')
poi_category   = enum('food','restroom','medical','merch','exit','family','prayer','gate','water')
notif_category = enum('critical','match','order','info')
emergency_type = enum('medical','lost_child','security','fire')
media_type     = enum('image','video')
dietary        = enum('halal','vegetarian','vegan','gluten_free')
```

## Models & relationships
```
users(id PK, email uq, display_name, role, locale, avatar_url, created_at)
  └─1:N tickets, orders, favorites, notifications, emergencies

matches(id PK, home_team_id FK, away_team_id FK, venue, kickoff_at, status,
        home_score, away_score, minute, updated_at)
  ├─1:N match_events, media, tickets
teams(id PK, name, short, crest_url)      └─1:N players
players(id PK, team_id FK→teams, name, number, position)
match_events(id PK, match_id FK, minute, type event_type, team_id FK, player_id FK?, detail)
  [idx: (match_id, minute)]

tickets(id PK, user_id FK, match_id FK, seat_id FK, gate_id FK, qr_token uq,
        status ticket_status, issued_at)     [idx: user_id, match_id]
seats(id PK, section, row, number, level)
gates(id PK, name, level, zone)

vendors(id PK, name, cuisine, rating numeric(2,1), level, zone, image_url)
  └─1:N food_items
food_items(id PK, vendor_id FK, name, price numeric(6,2), prep_minutes,
           dietary dietary[])                 [gin idx on dietary]
orders(id PK, user_id FK, vendor_id FK, status order_status, total, created_at)
  └─1:N order_items      [idx: user_id, status]
order_items(order_id FK, food_item_id FK, qty)   [PK (order_id, food_item_id)]

products(id PK, name, category, price numeric(8,2), image_url, sizes text[])
favorites(user_id FK, product_id FK, created_at)  [PK (user_id, product_id)]

media(id PK, match_id FK?, type media_type, thumbnail_url, full_url,
      streaming_url?, is_match_moment bool, taken_at)   [idx: (match_id, is_match_moment)]

notifications(id PK, user_id FK, category notif_category, title, body,
              read bool default false, deep_link, created_at)   [idx: (user_id, read)]

navigation_routes(id PK, from_zone, to_zone, step_free bool, distance_m, eta_minutes)
  [uq: (from_zone, to_zone, step_free)]   # cache of computed routes; live compute via routing/ kernel
parking_lots(id PK, name, capacity, occupied, zone, updated_at)
emergencies(id PK, user_id FK, type emergency_type, location, status, created_at)
```

## Constraints
- FK `ON DELETE`: `orders/order_items` cascade; `tickets` restrict (audit); `favorites` cascade.
- `tickets.qr_token` unique; `users.email` unique; `matches.minute` 0–130 check; `vendors.rating` 0–5 check; `orders.total` ≥ 0 check.

## Indexes (beyond PK/FK)
`matches(status)`, `tickets(user_id)`, `orders(user_id,status)`, `notifications(user_id,read)`, `media(match_id,is_match_moment)`, gin on `food_items.dietary`, `parking_lots(zone)`.

## Migration strategy
- Alembic; one migration per model group; never edit an applied migration. `alembic upgrade head` in the Cloud Run start/CI step. Seed script mirrors current `database/seed/*.json` so demo data survives the swap.

## Future scalability
- Read replicas for read-heavy fan traffic; partition `match_events`/`media` by `match_id` for large tournaments; move `notifications` fan-out + WS registry to Redis for horizontal Cloud Run; cache `home`/`vendors`/`pois` in Redis with short TTL.
