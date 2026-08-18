# Navigation & User-Flow Blueprint — "Sideline"
### Deliverable 2 of 2 — primary navigation map + core user flows

> **Companion doc:** `PRODUCT_ARCHITECTURE.md` (feature/module architecture).
> **No UI design yet** — this is structure, IA, and flows only.

---

## 1. Information Architecture (bird's-eye)

```
APP ROOT
│
├── Onboarding (first run only)
│     ├── Welcome
│     ├── Create identity (privacy-first; account optional)
│     ├── Join a group by CODE  ── or ──  Create a group
│     └── Enable notifications / location (contextual, skippable)
│
└── MAIN (5-tab bottom navigation)
      ├── 1. HOME              (personalized cross-group feed)
      ├── 2. GROUPS            (group switcher → group hub)
      ├── 3. SCHEDULE          (unified calendar → event detail)
      ├── 4. MARKETPLACE       (browse → listing → offer/message)
      └── 5. ME / WALLET       (profile, wallet, prefs, theme, settings)
```

Global overlays (mount high, above tab bar): **Messages** (from Home header icon), **Notifications/Alerts** (bell), **Composer bottom sheets**, **Toasts**. Never use OS Alert dialogs — use bottom sheets/toasts.

---

## 2. Tab-by-Tab Structure

### Tab 1 — HOME  (`/`)
The consumer-first "what matters to me now" surface. Aggregates across **all** groups.
- **Header:** greeting + avatar; icons for Messages and Alerts (bell).
- **Weather widget** (user location) — matches reference image; tap → Enhanced Weather detail.
- **Live Activities strip** — any live/imminent event rises to top ("Happening now / Next up").
- **Next event card** — with one-tap RSVP + Check-In when in window.
- **Action-needed feed** — RSVP nudges, unanswered polls, volunteer slots open, new forms.
- **Recent updates** — cross-group highlights (score posted, field changed, new album).
- **Group quick-switch row** — horizontal chips of the user's groups (single horizontal scroller; chips never wrap).

Routes: `/` , `/weather` , `/messages` , `/alerts`

### Tab 2 — GROUPS  (`/groups`)
- **Group list / switcher** (`/groups`): all joined groups + "Join by code" + "Create group".
- **Group hub** (`/groups/[groupId]`): the group's home with sections:
  - Chat (group messaging)
  - Schedule (this group's events)
  - Members (roster + roles)
  - Media & Files & Forms
  - Polls
  - Volunteers
  - Group settings (admin only — progressive disclosure)

Routes:
```
/groups
/groups/[groupId]                     (group hub)
/groups/[groupId]/chat
/groups/[groupId]/chat/[conversationId]
/groups/[groupId]/members
/groups/[groupId]/members/[memberId]
/groups/[groupId]/media
/groups/[groupId]/polls
/groups/[groupId]/volunteers
/groups/[groupId]/forms
/groups/[groupId]/settings            (admin)
```

### Tab 3 — SCHEDULE  (`/schedule`)
- **Unified calendar** across all groups (list + month toggle); filter chips by group (horizontal scroller).
- **Event detail** (`/schedule/[eventId]`): title, type, time (tz-safe), venue + map, weather at event time, RSVP, Check-In, volunteer slots, attendees, live status, post-event score.

Routes:
```
/schedule
/schedule/[eventId]
/schedule/[eventId]/rsvp
/schedule/[eventId]/checkin
/schedule/[eventId]/attendance        (admin)
/schedule/[eventId]/live
```

### Tab 4 — MARKETPLACE  (`/marketplace`)
- **Browse** with search + category/sport filter chips (horizontal scroller).
- **Listing detail** (`/marketplace/[listingId]`): photos, price, condition, seller, message/offer.
- **Create listing** (`/marketplace/new`).
- **My listings & offers** (`/marketplace/mine`).
- Messaging reuses the messaging system (in-app only; no contact info shared; no payments).

Routes:
```
/marketplace
/marketplace/[listingId]
/marketplace/new
/marketplace/mine
```

### Tab 5 — ME / WALLET  (`/me`)
- **Profile** (privacy-first; edit display name/avatar).
- **Wallet** (`/me/wallet`): coupons, promos, rewards, referral links (open external), expiry reminders.
- **Notification preferences** (`/me/notifications`): per-module + per-group, quiet hours.
- **Appearance** (`/me/appearance`): System / Light / Dark.
- **Settings** (`/me/settings`): privacy, blocked users, account, about.

Routes:
```
/me
/me/wallet
/me/notifications
/me/appearance
/me/settings
```

---

## 3. Core User Flows

Notation: `→` step, `⟶` navigation, `[decision]`.

### 3.1 First-run onboarding (join a group)
```
Launch ⟶ Welcome
  → Create identity (display name + avatar; account/email OPTIONAL for cross-device)
  → [Has a code?]
        yes → Enter group code → validate → joined ⟶ Group hub
        no  → Create group → name + sport → auto-generate join code → share sheet ⟶ Group hub
  → Contextual prompt: enable notifications (skippable)
  ⟶ HOME
```
Privacy note: no phone/email is ever exposed to other members; identity is app-scoped.

### 3.2 Create & schedule an event (organizer)
```
Group hub ⟶ Schedule → "+ New event"
  → type (practice/game/social) → title → date/time (tz-safe)
  → venue (pick saved or add) → [recurring?] → capacity/slots (optional)
  → attach: weather auto-linked, volunteer slots (optional), form (optional)
  → publish
  → system message to group chat + reminders scheduled + RSVP opened
  ⟶ Event detail
```

### 3.3 RSVP + reminder (member)
```
HOME "action-needed" OR push ⟶ Event detail
  → tap Going / Maybe / Not going
  → [capacity full?] → offered Waitlist → auto-promote on cancellation
  → [role/position slots?] → pick slot
  → confirmation toast
Non-responders → auto-nudge reminder before deadline
```

### 3.4 Check-In → Attendance (member + organizer)
```
Event start window opens → push "Check in now"
Member ⟶ Event detail → Check-In
   → method: [geofence at venue] auto | [scan event QR/code] | [manual one-tap]
   → [location denied?] → fallback to code/manual (never dead-end)
   → AttendanceRecord written → "You're checked in ✓"
Organizer → live roster: "14 going · 11 checked in" → manual override if needed
```

### 3.5 Live Activities (spectator/member)
```
Event within T-minus window OR marked live
  → rises to top of HOME as Live card (countdown → LIVE → FINAL)
  → tap ⟶ Live view: live score, updates ("Field → 4", "15 min late"), check-in count
  → "Follow" → push on each status change
  → organizer posts score → status FINAL → recorded to event history
```

### 3.6 Group messaging + poll (member)
```
Group hub ⟶ Chat
  → compose: text / media / @mention / reply-thread / react / pin
  → "+" → attach Poll → question + options + deadline + [anonymous?]
  → post → live results inline → auto-close at deadline
Read-by indicators; system messages for events/updates
```

### 3.7 Volunteer sign-up (member)
```
Event detail OR HOME feed → "Volunteers needed"
  → view slots (Snacks x2, Scorekeeper x1, Carpool x3)
  → claim a slot → confirmation + reminder scheduled
  → [need to back out] → unclaim → slot reopens + group notified
```

### 3.8 Marketplace list + offer (C2C, no payments)
```
Seller ⟶ Marketplace → "+ New listing"
  → photos (object storage) → title, price, condition, category, sport → publish
Buyer ⟶ Marketplace → search/filter chips → Listing detail
  → "Message seller" (in-app, no contact info) OR "Make offer" (amount + note)
  → negotiate in thread → agree → arrange handoff OFF-APP (no in-app payment)
  → seller marks "Sold"
Revenue: promoted listings + affiliate "buy new" links
```

### 3.9 Wallet + referral (member)
```
ME ⟶ Wallet
  → tabs: Coupons | Rewards | Referrals
  → coupon → show QR/barcode/code for external redemption
  → referral link → opens external shop in browser (click attributed)
  → earn reward on referral milestone → appears in Rewards
  → expiry reminder before a coupon lapses
Boundary: NO in-app payment, NO stored payment methods
```

### 3.10 Enhanced Weather (member)
```
HOME weather widget OR Event detail weather ⟶ Weather detail
  → current + feels-like + hi/lo (matches reference)
  → hourly timeline + multi-day forecast
  → per-event: weather AT event time & venue
  → "Playability" (good/caution/poor) + severe-weather alert banner
```

### 3.11 Notifications & theme preferences (member)
```
ME ⟶ Notifications → per-module toggles (events, chat, RSVP, polls, marketplace, wallet)
     → per-group overrides → quiet hours
ME ⟶ Appearance → System / Light / Dark (resolved at token layer app-wide)
```

### 3.12 Member management (admin)
```
Group hub ⟶ Settings (admin only)
  → Members → promote/demote (Owner/Admin/Member/Guest), mute, remove
  → Invites → regenerate join code / share invite link
  → Group profile → name, sport, icon, privacy
  → Premium → upgrade prompt (freemium flag; billing deferred)
```

---

## 4. Navigation Principles

1. **Consumer-first ordering:** Home (me) → Groups (us) → Schedule (do) → Marketplace (get) → Me/Wallet (own).
2. **Progressive disclosure:** members see the simple path; admin/advanced tools live one layer deeper (settings sheets, "More options").
3. **Contextual entry over new tabs:** Messaging, Live Activities, Notifications are surfaces reachable in context, not extra tabs — protects the 5-tab consumer layout.
4. **Sticky, safe-area-aware headers;** filter/category chip rows are single horizontal scrollers that never wrap.
5. **No dead-ends:** permission denial (location/notifications) degrades gracefully with fallbacks + "Open Settings".
6. **Platform-adaptive tab bar:** native tabs on iOS 26+, custom-styled `expo-router` Tabs elsewhere; clearly differentiated selected/unselected states.
7. **Theme-aware everything:** all colors from semantic tokens so system/light/dark are consistent.

---

## 5. Route Map (consolidated, expo-router file-based)

```
app/
├── _layout.tsx                         (root: theme provider, tabs)
├── onboarding/
│   ├── welcome.tsx
│   ├── identity.tsx
│   └── join-or-create.tsx
├── (tabs)/
│   ├── index.tsx                       HOME
│   ├── weather.tsx
│   ├── messages/index.tsx
│   ├── messages/[conversationId].tsx
│   ├── alerts.tsx
│   ├── groups/index.tsx
│   ├── groups/[groupId]/index.tsx
│   ├── groups/[groupId]/chat.tsx
│   ├── groups/[groupId]/members.tsx
│   ├── groups/[groupId]/media.tsx
│   ├── groups/[groupId]/polls.tsx
│   ├── groups/[groupId]/volunteers.tsx
│   ├── groups/[groupId]/forms.tsx
│   ├── groups/[groupId]/settings.tsx
│   ├── schedule/index.tsx
│   ├── schedule/[eventId]/index.tsx
│   ├── schedule/[eventId]/live.tsx
│   ├── schedule/[eventId]/checkin.tsx
│   ├── marketplace/index.tsx
│   ├── marketplace/[listingId].tsx
│   ├── marketplace/new.tsx
│   ├── marketplace/mine.tsx
│   ├── me/index.tsx
│   ├── me/wallet.tsx
│   ├── me/notifications.tsx
│   ├── me/appearance.tsx
│   └── me/settings.tsx
```

*(Illustrative route map for the eventual build — not implemented yet.)*

---

## 6. Recommended Approval Gate

Before any UI design starts, please confirm:
1. 5-tab primary navigation (Home / Groups / Schedule / Marketplace / Me-Wallet) ✅ / adjust
2. Messaging as a contextual surface (no dedicated tab) in V1 ✅ / adjust
3. V1 scope per `PRODUCT_ARCHITECTURE.md` §7 ✅ / adjust
4. The four open questions in `PRODUCT_ARCHITECTURE.md` §9

Once approved, next step is UI/UX design (screens, components, theme tokens) — then build.
