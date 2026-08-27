# PRD — "Sideline" (working title)
### Modern, consumer-first, multi-sport organization & communication app (TeamReach-inspired)

## Original Problem Statement
Build a modern sports organization/communication app inspired by TeamReach's functional model (not its UI/branding). First deliverable is a product/feature/module architecture + navigation/user-flow blueprint — NO UI design until architecture is approved. Support system/light/dark themes.

## Locked Decisions (from stakeholder)
- Sport scope: **Multi-sport / sport-agnostic** — every group behaves identically; sport is metadata.
- Core user: **Everyday player / member** (consumer-first).
- New modules (Live Activities, Check-In, Enhanced Weather, Marketplace, Wallet): **all core V1**.
- Deliverable expected: **Architecture doc + navigation/user-flow blueprint**.
- Monetization: **Freemium + Marketplace/Wallet affiliate & referral revenue**.
- Theme: System / Light / Dark.

## User Personas
- **Player/Member (primary):** wants glanceable "what's next for me," easy RSVP/check-in, chat, gear deals.
- **Organizer/Coach/Admin (secondary):** creates events, manages roster/roles, tracks attendance, coordinates volunteers.
- **Parent/Guardian:** stays informed, RSVPs on behalf, receives reminders.

## Architecture Summary
- **Retain:** multi-group, join-by-code, privacy-by-design, schedules+maps.
- **Improve:** messaging, RSVP, attendance, events, notifications, media/files/forms, polls, volunteers, member management, scores, weather.
- **New:** Live Activities, Check-In, Enhanced Weather, Marketplace (C2C, no in-app payments), Wallet (coupons/rewards/referrals), consumer Home feed, freemium.
- **Primary nav:** 5-tab bottom nav — Home / Groups / Schedule / Marketplace / Me-Wallet. Messaging & Live Activities are contextual surfaces (no dedicated tab in V1).

## Deliverables Produced (2026-06)
- `/app/memory/PRODUCT_ARCHITECTURE.md` — full audit (retain/improve/new), module catalog, nav rationale, monetization, V1-vs-future, system architecture, open questions.
- `/app/memory/NAVIGATION_USER_FLOWS.md` — IA map, tab-by-tab structure, 12 core user flows, navigation principles, expo-router route map, approval gate.

## Status
- Deliverable 1 & 2 (architecture + navigation/flows): **COMPLETE**.
- **Frontend build (no backend): COMPLETE** — 2026-06. Full 5-tab app with local mock data, system/light/dark themes, premium emerald design system, custom fonts (Plus Jakarta Sans + JetBrains Mono).
- Backend: not started (per user request — frontend only for now).

## Frontend Implemented (2026-06, mock data)
- **Design system**: `src/theme/` (tokens + ThemeProvider with system/light/dark, persisted via storage). Emerald palette, Plus Jakarta Sans / JetBrains Mono fonts (downloaded to assets/fonts), glass tab bar + weather widget (expo-blur), reusable `src/components/ui.tsx` + `cards.tsx`.
- **Navigation**: 5-tab bottom nav (Home, Groups, Schedule, Marketplace, Me) + stack detail routes.
- **Home**: greeting, glass weather widget, Live Now strip, Next Up featured card, Needs-You action feed, Your Teams list.
- **Groups**: join-by-code input, sport filter chips, group list → **Group Hub** (feature tiles, live poll, upcoming events, members, chat preview).
- **Schedule**: date strip, type filter chips, event cards with inline RSVP segmented control.
- **Event detail**: cover, live score banner, when/where + directions (opens maps), RSVP, attendee stack, volunteer slots, sticky Check-In bar.
- **Marketplace**: search, category chips, 2-col grid, like toggle, FAB, **Listing detail** (seller, message/offer, affiliate nudge — no in-app payments).
- **Me/Wallet**: profile + stats, wallet carousel (coupons/rewards/referral), settings, **Appearance** theme picker, push toggle.
- **Chat**: message bubbles + reactions, keyboard-safe input (react-native-keyboard-controller), send appends message.
- **Enhanced Weather**: hero, playability, hourly timeline, 5-day forecast.
- **Verified**: testing_agent iteration_2 — 100% pass, real light/dark switching confirmed, zero JS errors.

## Data source
- All content is local mock in `/app/frontend/src/data/mock.ts`. No API, no auth. Ready to be wired to a FastAPI/MongoDB backend later.


## Open Questions (non-blocking, §9 of architecture doc)
1. Identity/auth model (anonymous device vs. optional account).
2. Marketplace V1 reach (within-group vs. broader community).
3. Weather provider + native Live Activities widgets timing.
4. Exact premium-tier feature list.

## Prioritized Backlog
- **P0 (V1):** all modules in PRODUCT_ARCHITECTURE §7 "V1".
- **P1 (V1.x):** Spanish i18n, email channel, calendar sync, native OS Live Activities, geofence hardening.
- **P2 (V2+):** dedicated Messaging tab, real billing/payments, leagues/brackets, org analytics, fundraising/dues, AI assist, public group directory, wearable, marketplace escrow.

## Paid/Registered Events Module (planned 2026-06 — see PAID_EVENTS_MODULE.md)
- Three event modes: Simple RSVP / Registration-Free / Registration-Paid.
- Paid = attendee pays organizer directly via PayPal/Venmo link (off-app, honor system). Sideline never handles funds.
- Revenue: per-event creation fee via IAP (RevenueCat consumable, Path 1). No subscription in V1.
- Auth deferred; near-term build is UI/flow on mock data. Real accounts required before production launch.
- Status: PLANNED, decisions locked, not yet built.

## Paid/Registered Events Module (BUILT 2026-06 — frontend, mock data)
- Three event modes live: Simple RSVP / Registration-Free / Registration-Paid.
- Free registration: capacity/waitlist, custom fields, register/cancel. Paid: attendee pays organizer directly via PayPal/Venmo deep links (off-app), marks paid → organizer confirms (honor system). Sideline never handles funds.
- Organizer roster (/roster/[id]) with confirm-paid + collected tally. Attendee flow (/register/[id]).
- Monetization: per-event creation fee paywall (/paid-event-fee) — simulated IAP in preview; real RevenueCat IAP deferred to device build.
- State via in-memory store (src/data/store.ts, useSyncExternalStore). Verified: testing_agent iteration_3, 30/30 pass.
- Files: register/[id].tsx, roster/[id].tsx, paid-event-fee.tsx, store.ts; event/[id].tsx + schedule + me + cards updated.
- Deferred to production: real accounts/organizer identity, RevenueCat IAP wiring, optional PayPal/Venmo API auto-verification.

## Next Tasks
1. Stakeholder approval of navigation + V1 scope + open questions.
2. UI/UX design phase (theme tokens for system/light/dark, screens, components).
3. Build phase (Expo + FastAPI + MongoDB + Object Storage; integrations via integration expert).
