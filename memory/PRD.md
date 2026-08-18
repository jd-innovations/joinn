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
- Deliverable 1 & 2 (architecture + navigation/flows): **COMPLETE**, awaiting stakeholder approval.
- UI design: **NOT STARTED** (blocked on approval, per instruction).
- Build: not started.

## Open Questions (non-blocking, §9 of architecture doc)
1. Identity/auth model (anonymous device vs. optional account).
2. Marketplace V1 reach (within-group vs. broader community).
3. Weather provider + native Live Activities widgets timing.
4. Exact premium-tier feature list.

## Prioritized Backlog
- **P0 (V1):** all modules in PRODUCT_ARCHITECTURE §7 "V1".
- **P1 (V1.x):** Spanish i18n, email channel, calendar sync, native OS Live Activities, geofence hardening.
- **P2 (V2+):** dedicated Messaging tab, real billing/payments, leagues/brackets, org analytics, fundraising/dues, AI assist, public group directory, wearable, marketplace escrow.

## Next Tasks
1. Stakeholder approval of navigation + V1 scope + open questions.
2. UI/UX design phase (theme tokens for system/light/dark, screens, components).
3. Build phase (Expo + FastAPI + MongoDB + Object Storage; integrations via integration expert).
