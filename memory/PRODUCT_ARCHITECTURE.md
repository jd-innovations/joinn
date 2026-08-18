# Product Architecture — "Sideline" (working title)
### A modern, consumer-first sports organization & communication app

> **Status:** Product architecture proposal (Deliverable 1 of 2). **No UI design yet.**
> **Companion doc:** `NAVIGATION_USER_FLOWS.md` (primary navigation + user flows).

---

## 0. Foundational Decisions (locked with stakeholder)

| Decision | Choice | Implication for architecture |
|---|---|---|
| **Sport scope** | Multi-sport / sport-agnostic | Every group behaves identically regardless of sport. Sport is metadata (icon, label, optional score template) — never a hard fork in logic. |
| **Core user** | Everyday player / member (consumer-first) | Default experience is "what's next for me" not "manage my roster." Admin power lives behind progressive disclosure. |
| **New modules (Live Activities, Check-In, Enhanced Weather, Marketplace, Wallet)** | All shipped as **core V1** | They are first-class citizens in the IA, not add-ons. |
| **Monetization** | Freemium + Marketplace/Wallet affiliate & referral revenue | Architecture must support (a) a premium tier flag on groups/users, (b) external referral/affiliate link tracking, (c) zero in-app payment processing for marketplace. |
| **Theme** | System / Light / Dark | Design tokens must be semantic (not hard-coded colors). Theme is a global setting resolved at the token layer. |

---

## 1. Product Positioning

**One line:** The team app that feels like a consumer social app — organize your games, know who's in, and never miss a moment — while quietly handling all the coordination underneath.

**Positioning vs. TeamReach:**

- TeamReach = *utility*. It wins on simplicity, privacy (join-by-code, no contact info shared), and "always free." It looks and feels like management software.
- Our product = *consumer sports companion*. We keep TeamReach's privacy-first, join-by-code simplicity as table stakes, then layer a modern, glanceable, "for me" experience (Live Activities, richer weather, personal wallet) plus lightweight community commerce (Marketplace).

**Design north star:** Simplicity, strong visual hierarchy, progressive disclosure, premium mobile-first. Depth is *available*, never *in your face*.

---

## 2. TeamReach Functionality Audit

Legend: **RETAIN** (keep as-is conceptually) · **IMPROVE** (keep but meaningfully upgrade) · **NEW** (our differentiator, not in TeamReach).

### 2.1 What TeamReach does (from product research at teamreach.com)

| # | TeamReach capability | Our verdict | Notes |
|---|---|---|---|
| 1 | **Multiple groups / teams** from one app | RETAIN | Core mental model. A user belongs to many groups; each is a self-contained space. |
| 2 | **Join by group code** (no phone/email exchange) | RETAIN | This is TeamReach's killer privacy feature. Non-negotiable to keep. |
| 3 | **Group messaging** | IMPROVE | Add threads, reactions, @mentions, pinned messages, read-by, rich media. |
| 4 | **Direct (member-to-member) messaging** | IMPROVE | Keep contact info private; DMs routed through app identity only. |
| 5 | **Schedules / events** (practice, game, meet-up) | IMPROVE | Add recurring events, series, calendar sync, timezone safety, "next up" surfacing. |
| 6 | **RSVP / availability** (going / not going / maybe) | IMPROVE | Add waitlists, roster caps, per-position/role slots, auto-reminders to non-responders. |
| 7 | **Attendance tracking** | IMPROVE | Split from RSVP: attendance = who *actually* showed. Powered by new **Check-In**. |
| 8 | **Scores / results recording** | IMPROVE | Structured score entry + history; feeds Live Activities. |
| 9 | **Maps, directions, locations** | RETAIN | Tap address → open native maps. Add saved venues + geofence for Check-In. |
| 10 | **Weather forecast on events** | IMPROVE → **Enhanced Weather** | See module 4.3. |
| 11 | **Reminders & notifications** (push + email) | IMPROVE | Granular per-module preferences, quiet hours, smart nudges. |
| 12 | **Photos, videos & files** | IMPROVE | Cloud object storage, albums per event, faster galleries, file categories. |
| 13 | **Forms** (documents/media availability) | IMPROVE | Structured forms (waivers, sign-ups) with response tracking. |
| 14 | **Polls** (implied via availability/updates) | IMPROVE | First-class polls: single/multi choice, deadlines, anonymous option. |
| 15 | **Volunteer coordination / sign-ups** | IMPROVE | Slot-based sign-up sheets (snacks, carpool, refs) with reminders. |
| 16 | **Member management / roles** | IMPROVE | Roles (Owner/Admin/Member/Guest), roster, profiles, mute/remove, invite links. |
| 17 | **Instant updates** ("Field changed → Field 4") | IMPROVE → **Live Activities** | Elevate last-minute updates into a live status surface. See 4.1. |
| 18 | **Privacy by design** (no shared contact info) | RETAIN | System-wide principle, not a feature. |
| 19 | **Always free** | CHANGE | We go **freemium** (see §6). Core stays free; premium org tools + commerce revenue. |
| 20 | **English + Spanish** | RETAIN (future) | Architecture is i18n-ready; ES is a fast-follow, not V1 blocker. |

### 2.2 Summary of the three buckets

**A) Retain (keep the winning simplicity):**
- Multiple groups from one app
- Join-by-code onboarding, privacy-by-design (no contact info shared)
- Schedules with maps/directions
- The "one home base, no group-text chaos" promise

**B) Improve (same job, dramatically better):**
- Messaging → threads, reactions, mentions, pins, read receipts, DMs
- RSVP → caps, waitlists, role/position slots, auto-nudges
- Attendance → decoupled from RSVP, driven by Check-In
- Events → recurring/series, calendar sync, timezone-safe, "next up" surfacing
- Notifications → per-module granularity + quiet hours + smart nudges
- Media/Files → object-storage backed, albums, categories
- Polls, Volunteer sign-ups, Forms → all promoted to structured first-class modules
- Weather → Enhanced Weather module
- Member management → real role model + invites + moderation
- Scores → structured, historical, feeds Live Activities

**C) New / differentiating (not in TeamReach):**
- **Live Activities** — real-time game/event status & live info
- **Check-In** — geofence/code/manual member check-in powering attendance
- **Enhanced Weather** — rich widgets, hourly/daily, event-specific "playability"
- **Marketplace** — lightweight C2C sports gear listings (no in-app payments)
- **Wallet** — coupons, promos, rewards, referral links to external shops
- **"For Me" consumer home** — personalized, glanceable feed across all groups
- **Freemium model** — premium organizer tools + affiliate/referral revenue

---

## 3. Core Module Catalog (Retained + Improved)

Each module below lists: **Purpose → Key entities → V1 behaviors → Progressive-disclosure notes.**

### 3.1 Groups & Teams
- **Purpose:** Self-contained spaces a user joins; the container for everything else.
- **Entities:** `Group` (id, name, sport, icon, joinCode, privacy, premiumFlag), `Membership` (user↔group, role, status), `Role` enum.
- **V1 behaviors:** Create group → auto join code; join by code; multi-group switcher; group profile; leave/mute; owner transfer.
- **Progressive disclosure:** Members see chat + schedule first. Admin tools (roles, settings, invite management) tucked in a group settings sheet.

### 3.2 Messaging (Group + Direct)
- **Purpose:** Private, in-app communication without exchanging contact info.
- **Entities:** `Conversation` (group | direct | thread), `Message` (text, media, poll ref, event ref), `Reaction`, `ReadReceipt`, `Pin`.
- **V1 behaviors:** Group chat, DMs, media attachments, reactions, @mentions, reply/thread, pin, read-by, system messages (e.g., "Event updated").
- **Progressive disclosure:** Rich composer (poll/event/volunteer attach) behind a "+" affordance.

### 3.3 Events & Scheduling
- **Purpose:** The when/where of every practice, game, meet-up.
- **Entities:** `Event` (type, title, venueRef, start/end, timezone, recurrence, capacity), `EventSeries`, `ScoreRecord`.
- **V1 behaviors:** Create one-off & recurring events; event types (practice/game/social/other); venue + map; attach weather; RSVP; reminders; post-event score.
- **Progressive disclosure:** Advanced (recurrence, caps, role slots) revealed via "More options."

### 3.4 RSVP / Availability
- **Purpose:** Know who's coming before the event.
- **Entities:** `Rsvp` (going/maybe/notGoing/waitlist), `SlotAssignment` (position/role).
- **V1 behaviors:** One-tap RSVP; capacity + waitlist; auto-promote from waitlist; role/position slots; auto-nudge non-responders; organizer summary counts.

### 3.5 Attendance (decoupled)
- **Purpose:** Who *actually* attended (vs. who said they would).
- **Entities:** `AttendanceRecord` (source: checkin/manual, timestamp).
- **V1 behaviors:** Attendance auto-populated by Check-In; manual override by admin; per-member attendance history & rate.

### 3.6 Polls
- **Purpose:** Fast group decisions.
- **Entities:** `Poll` (question, options, multi, anonymous, deadline), `Vote`.
- **V1 behaviors:** Create in chat or standalone; live results; deadline auto-close; anonymous option.

### 3.7 Volunteer Coordination
- **Purpose:** Fill jobs (snacks, carpool, scorekeeper, refs).
- **Entities:** `SignUpSheet` (event ref, slots), `Slot` (label, qty, assignees).
- **V1 behaviors:** Create slots, claim/unclaim, remaining-count, reminders to claimants.

### 3.8 Media & Files & Forms
- **Purpose:** Relive moments; distribute documents; collect structured info.
- **Entities:** `Album`, `MediaItem` (object-storage URL), `FileItem` (category), `Form` (fields), `FormResponse`.
- **V1 behaviors:** Event albums, upload photo/video/file, categories, forms with response tracking (e.g., waiver acknowledged). **All binary assets in object storage — never base64 in DB.**

### 3.9 Locations, Maps & Directions
- **Purpose:** Get everyone to the right place.
- **Entities:** `Venue` (name, address, lat/lng, notes, geofenceRadius).
- **V1 behaviors:** Saved venues; tap → native maps/directions; venue reused across events; feeds Check-In geofence & weather lookup.

### 3.10 Notifications & Reminders
- **Purpose:** The right nudge at the right time, never noisy.
- **Entities:** `NotificationPreference` (per module, per group), `ScheduledReminder`.
- **V1 behaviors:** Per-module + per-group toggles; event reminders (e.g., 24h/2h before); RSVP nudges; quiet hours; in-app + push (email fast-follow).
- **Note:** Push is only testable on a real device build (not Expo Go / web preview).

### 3.11 Member Management
- **Purpose:** Roster + roles + moderation.
- **Entities:** `Membership`, `Role` (Owner, Admin, Member, Guest), `Invite`.
- **V1 behaviors:** Roster list, member profiles, promote/demote, mute/remove, invite links + join code regeneration.

---

## 4. New Differentiating Modules (all core V1)

### 4.1 Live Activities
- **Purpose:** Turn "instant updates" into a real-time, glanceable status surface for an in-progress or imminent event.
- **Entities:** `LiveActivity` (event ref, status: pre/live/final, liveScore, lastUpdate, location change flag), `LiveUpdate` (feed of changes).
- **V1 behaviors:**
  - "Happening now / next up" card on Home.
  - Live status: countdown → LIVE → final.
  - Live score + key updates ("Field changed → Field 4", "Running 15 min late").
  - Live RSVP/attendance counts ("14 going · 11 checked in").
  - Tap-to-follow an event; push on status change.
- **Progressive disclosure:** Rich live view only when an event is live/imminent; otherwise collapses to a normal event card.
- **Platform note:** OS-level Live Activities (iOS Dynamic Island / Android ongoing notification) require a native build; in V1 the in-app live surface works everywhere, native OS widgets are a build-time enhancement.

### 4.2 Check-In
- **Purpose:** Frictionless "I'm here," powering true attendance.
- **Entities:** `CheckInSession` (event ref, method, window), `CheckInRecord`.
- **V1 behaviors:**
  - Methods: geofence (at venue), event QR/code, or one-tap manual.
  - Check-in window opens around start time.
  - Auto-writes `AttendanceRecord`.
  - Organizer live roster of who's in.
- **Permissions:** Location requested *contextually* at first check-in, with graceful denial fallback to code/manual (never dead-ends the user). Geofence is a build-time enhancement; code/manual work everywhere.

### 4.3 Enhanced Weather
- **Purpose:** From a static forecast to decision-useful, event-specific weather.
- **Entities:** `WeatherSnapshot` (venue+time keyed, current/hourly/daily, feels-like, precip %, wind, UV, alerts), `PlayabilityScore` (derived).
- **V1 behaviors:**
  - Home weather widget for user's location (matches reference image).
  - Per-event weather at event time & venue.
  - Hourly timeline + multi-day forecast.
  - "Playability" indicator (good / caution / poor) + severe-weather alerts.
- **Note:** Weather via a weather data provider (integration to be confirmed at build time).

### 4.4 Marketplace (lightweight C2C, no in-app payments)
- **Purpose:** Community-driven buy/sell/trade of sports gear. Drives engagement + affiliate revenue.
- **Entities:** `Listing` (title, price, condition, category, photos, sellerRef, status), `Offer` (buyer, amount, message), `MarketplaceThread` (reuses messaging).
- **V1 behaviors:**
  - Browse/search/filter by category & sport.
  - Create listing with object-storage photos.
  - Message seller & make offers **in-app** (no payment processing — payment/handoff happens off-app).
  - Save/favorite listings; mark sold.
  - Scope toggle: within-group vs. broader community (privacy-respecting).
- **Monetization hook:** Promoted listings + affiliate links to retail partners for "buy new instead."
- **Trust/safety:** Report listing, block user, no contact info exchanged (in-app messaging only) — consistent with privacy principle.

### 4.5 Wallet
- **Purpose:** A personal pocket of value — coupons, promos, rewards, referral links to external shops/sites. Revenue engine.
- **Entities:** `WalletItem` (type: coupon/promo/reward/referral, code, partner, expiry, externalUrl, redeemed), `ReferralLink` (user, campaign, clicks).
- **V1 behaviors:**
  - Collection of coupons/offers (barcode/QR/code display).
  - Rewards from app engagement (e.g., referral milestones).
  - Referral links to external shops (open in browser; **all commerce is external**).
  - Expiry reminders.
- **Monetization hook:** Affiliate/referral tracking on outbound links; partner-sponsored offers.
- **Boundary:** No in-app payments, no stored payment methods. Wallet stores *value references*, not money.

---

## 5. Recommended Primary Navigation

> Full flows in `NAVIGATION_USER_FLOWS.md`. Summary here.

Because the core user is the **everyday player**, the IA is "for me" first, "manage" second. We use a **5-tab bottom navigation** — the ceiling for thumb-friendly mobile nav — chosen because the app has 4–5 distinct functional areas with frequent context switching.

| Tab | Name | Contains | Why it's a tab |
|---|---|---|---|
| 1 | **Home** | Personalized cross-group feed: next event, Live Activities, weather widget, RSVP nudges, recent updates | Consumer-first "what matters to me now." |
| 2 | **Groups** | Group switcher + per-group hub (chat, schedule, media, members, polls, volunteers, files/forms) | The container for all team activity. |
| 3 | **Schedule** | Unified calendar across all groups; event detail → RSVP, Check-In, weather, maps, live | Scheduling is the most-used job; deserves top-level access. |
| 4 | **Marketplace** | Browse/search/list gear; offers & saved items | Distinct commerce surface; drives engagement + revenue. |
| 5 | **Me / Wallet** | Profile, Wallet (coupons/rewards/referrals), notification prefs, theme (system/light/dark), settings | Personal value + account; keeps admin/settings out of the main flow. |

**Messaging placement:** Chat/DMs are reachable both inside a group (group chat) and via a messages entry (a header icon on Home + within Groups). We deliberately **do not** give messaging its own tab in V1 to preserve the 5-tab consumer layout — messaging is contextual to a group. (Re-evaluate if DM usage proves high enough to warrant its own tab in V2.)

**Live Activities placement:** Not a tab — it's a *surface* that rises to the top of Home and appears as an event's live state. This keeps it glanceable without adding IA weight.

**Platform detail:** iOS 26+ uses native tabs (`expo-router/unstable-native-tabs`, SF Symbols, liquid glass); Android and older iOS use the standard `expo-router` `Tabs` with a custom-styled bar. Selected vs. unselected tabs are clearly differentiated (dark selected / light unselected).

---

## 6. Monetization Architecture (Freemium + Affiliate/Referral)

**Principle:** Core team coordination is free forever (protects the TeamReach-style adoption). Money comes from (a) premium organizer tooling and (b) commerce surfaces.

| Stream | Where | V1 scope | Data hooks |
|---|---|---|---|
| **Freemium — Premium groups** | Group-level | Free: core messaging/schedule/RSVP. Premium: larger media storage, advanced roles, recurring events at scale, priority reminders, custom branding | `Group.premiumFlag`, `Subscription` (out of scope for payment in V1 — flag-only, real billing via a payment integration later) |
| **Marketplace** | Marketplace tab | Promoted/featured listings; affiliate "buy new" links | `Listing.promoted`, affiliate link tracking |
| **Wallet / Referral** | Me/Wallet tab | Partner-sponsored coupons; outbound referral links with click attribution | `ReferralLink.clicks`, `WalletItem.partner` |

**Non-negotiable boundary:** No in-app payment processing for Marketplace (C2C handoff is off-app). Any future paid subscription would route through the appropriate store-compliant integration — **not** built now.

---

## 7. V1 vs. Future Releases

### V1 (ships now — the complete architecture above)
**Core (retained + improved):**
- Groups & join-by-code, multi-group
- Group + direct messaging (reactions, mentions, pins, read-by)
- Events & scheduling (one-off + recurring), unified calendar
- RSVP/availability (caps, waitlist, slots, nudges)
- Attendance (via Check-In)
- Polls
- Volunteer sign-ups
- Media, files, forms (object storage)
- Locations, maps, directions
- Notifications & reminders (per-module prefs, quiet hours)
- Member management & roles

**New (all core V1):**
- Live Activities (in-app live surface)
- Check-In (code/manual everywhere; geofence where build supports)
- Enhanced Weather
- Marketplace (C2C, no payments)
- Wallet (coupons/rewards/referral links)

**System-wide V1:**
- Consumer-first Home feed
- System / Light / Dark theme
- Freemium flags + affiliate/referral tracking scaffolding
- Privacy-by-design (no contact info shared, in-app identity only)

### V1.x fast-follow (near-term, low risk)
- Spanish (i18n) localization
- Email notifications channel
- Calendar (ICS/Google) two-way sync
- Native OS Live Activities (Dynamic Island / ongoing notification) — requires native build
- Geofence Check-In hardening

### V2 / Future (deliberately deferred)
- Dedicated Messaging tab (only if DM usage justifies)
- Real subscription billing / payments integration (store-compliant)
- League / multi-team tournament brackets & standings
- Advanced analytics (attendance trends, engagement dashboards for orgs)
- Team fundraising / dues collection (payments)
- AI assist (auto-schedule, smart reminders, message summarization)
- Public discoverable groups / community directory
- Wearable companion (live score glances)
- Marketplace escrow/verified sellers (still off-app payments)

---

## 8. High-Level System Architecture (for build phase — not implemented yet)

- **Frontend:** Expo (React Native) + expo-router file-based routing. Semantic design tokens for system/light/dark. `expo-image`, reanimated, object-storage-backed media.
- **Backend:** FastAPI, all routes prefixed `/api`. MongoDB with `PyObjectId` + `BaseDocument` pattern (no raw ObjectId in responses).
- **Storage:** Emergent Managed Object Storage for all photos/videos/files/listing images.
- **Integrations (to confirm at build time via integration expert):** Auth (privacy-first; join-by-code identity), Weather data provider, Push notifications (native build), affiliate/referral link tracking.
- **Cross-cutting:** Privacy (no contact info exposed), theming, notification preferences, role-based access, i18n-ready.

---

## 9. Open Questions for Stakeholder (non-blocking)

1. **Identity/auth model:** Join-by-code keeps contact info private, but do we still want an account (email or social login) behind it for cross-device continuity? Or fully anonymous device identity in V1?
2. **Marketplace scope in V1:** within-group only, or a broader community marketplace from day one? (Trust/safety scales with reach.)
3. **Weather provider & Live Activities native widgets:** confirm we want the native-build enhancements in the first build or as a fast-follow.
4. **Premium tier contents:** which specific capabilities sit behind the paywall (draft list in §6 — needs your confirmation).

---

*Next deliverable: `NAVIGATION_USER_FLOWS.md` — primary navigation map + detailed user flows. UI design begins only after this architecture is approved.*
