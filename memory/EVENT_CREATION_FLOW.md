# Feature Plan — Event Creation Flow ("List an Event")
### "Sideline" · planning only (no code)

> A single, sport-agnostic **create-event wizard** that feels as easy as posting a
> Marketplace listing, but scales up to full **registration** and **paid** events. Reuses
> the three event modes already built (Simple RSVP / Registration-Free / Registration-Paid)
> and the paid-event creation-fee gate.

---

## 1. Goals & Principles

- **One flow for every sport.** Sport is metadata (label/icon), never a branch in logic.
- **Simple by default, robust on demand.** A pickup game = ~20 seconds, 4 taps. A paid clinic with a registration form = same flow, a few more steps that only appear when relevant (progressive disclosure).
- **Listing-flow mental model.** Same "compose → preview → publish" rhythm as the Marketplace "Sell" flow, so it feels familiar.
- **Never lose work.** Auto-save a **draft** at every step; resumable.
- **Publish is reversible.** Edit or unpublish after the fact.

---

## 2. Entry points
- **Groups → Create** (primary; event is created inside a group).
- **Schedule tab → "+" / floating button** (pick a group, then create).
- **Me → Organizer Tools → Create a paid event** (jumps straight into the flow pre-set to Paid).
- Today's standalone `paid-event-fee` mini-form is **absorbed** into this wizard as the Payment + Fee step.

Permissions: any member can create in V1 (consumer-first); a future group setting can restrict creation to Admins/Owners.

---

## 3. The wizard — step by step

A short, top **progress indicator** (e.g. 5 dots). Each step is one focused screen with a sticky "Continue" button. Back navigates a step; close prompts "Save draft?".

### Step 1 — Basics (the 20-second core)
- **Event type**: Game · Practice · Social · Meet · Other (chips). Drives the icon + default title hint.
- **Title** (required).
- **Group** (pre-filled if entered from a group; selectable otherwise).
- **Sport** auto-inherits from the group; editable.
- *(Optional)* short **description**.

### Step 2 — When
- **Date + start time** (required, timezone-safe).
- **Duration** (quick chips: 60/90/120 min + custom).
- **Recurring?** toggle → simple recurrence (Does not repeat / Daily / Weekly on {days} / Custom) with an end condition. *(V1 can ship "Does not repeat" + "Weekly"; richer rules later.)*

### Step 3 — Where
- **Venue**: pick from **saved venues** or add new (name + address). Address feeds maps/directions.
- Auto-attaches **weather** for the event time & venue (from the Enhanced Weather module).
- *(Optional)* arrival notes ("Field 4, park on north side").

### Step 4 — Participation (the fork; this is the "robust" part)
Choose how people join — this maps to the existing modes:
- **RSVP (simple)** → Going / Maybe / Can't. Optional headcount cap. *Done — skip to Review.*
- **Registration (free)** → committed spots.
- **Registration (paid)** → committed spots + payment.

If Registration is chosen, reveal:
- **Capacity** + **Waitlist** toggle.
- **Registration deadline**.
- **Custom questions** builder — add fields (Short text / Yes-No toggle / choose-one). Examples: skill level, shirt size, emergency contact, waiver acknowledgement. Reorder / mark required.

### Step 5 — Payment (only if "Registration – paid")
- **Price per person**.
- **Accepted methods**: PayPal / Venmo (from organizer's saved links; prompt to add if missing). Clear banner: *payments go directly to the organizer; Sideline doesn't process them.*
- **Refund policy** (free text the organizer sets).
- **Platform creation-fee gate**: shows the one-time per-event fee; **"Pay fee & Publish"** via in-app purchase (the step we already prototyped). Free/RSVP/free-registration events **skip this entirely**.

### Step 6 — Extras (optional, collapsible)
- **Cover photo** (from library / suggested sport image). *Stored in object storage when backend exists; mock now.*
- **Volunteer slots** (label + count — e.g. Snacks×2, Scorekeeper×1).
- **Attach a poll** or **form**.
- **Reminders**: default on (24h + 2h before); editable.
- **Visibility**: group-only (default) vs group + waitlist-shareable link.

### Step 7 — Review & Publish
- A **live preview card** exactly as it'll appear in Schedule/Home (the "listing preview").
- Summary of key fields with tap-to-edit jump-backs.
- **Publish** → posts a system message to the group chat, schedules reminders, opens RSVP/registration.
- For paid events, Publish = the fee purchase.

---

## 4. Parallel to the Marketplace "listing" flow

| Marketplace (Sell) | Event Creation (List) |
|---|---|
| Photos | Cover photo (Extras) |
| Title / description | Title / description (Basics) |
| Price + condition | Price + type (Basics/Payment) |
| Category / sport | Type / sport / group |
| Preview card | Live event preview (Review) |
| Publish listing | Publish event |
| Message/offer (no in-app pay) | Attendee pays organizer directly (no in-app pay) |

Same compose→preview→publish rhythm; same "we don't process peer money" stance. Difference: events add **When/Where/Participation** and the **paid-event fee**.

---

## 5. Data model (reuse what exists)
Maps onto the current `EventItem` + registration store — mostly already there:
- `type, title, groupId, sport, description`
- `start, durationMin, timezone, recurrence?`
- `venue { name, address, lat/lng, notes }`
- `mode: simple | reg_free | reg_paid`
- `registration { capacity, waitlistEnabled, deadline, customFields[] }`
- `paid { price, methods[], refundPolicyText }`
- `cover, volunteersNeeded[], reminders, visibility`
- `status: draft | published | cancelled`
New bits to add later: `recurrence`, `visibility`, `status`, `reminders`, `customField.required/type=choice`.

---

## 6. UX rules (consistent with our design system)
- Sticky header + progress dots; sticky "Continue"/"Publish" bar (keyboard-safe).
- Chips for type/duration/recurrence are single horizontal scrollers (no wrap).
- Inputs use the keyboard-controller patterns already in the app.
- Every step validates before Continue; inline errors, never dead-ends.
- Light/Dark aware; haptics on key actions.
- Draft auto-saves locally (and to backend once it exists).

---

## 7. V1 vs. Future

**V1 (buildable now on mock data)**
- Full wizard: Basics → When → Where → Participation → (Payment) → Extras → Review/Publish.
- Modes: RSVP, Registration-free, Registration-paid (reusing built module).
- Saved/added venues, weather auto-attach, capacity/waitlist/deadline, custom questions (text + toggle), cover photo (mock), volunteer slots, reminders default, draft save, live preview, edit after publish.
- Paid = fee gate (simulated IAP in preview).

**Future**
- Rich recurrence (RRULE), calendar sync.
- Real cover-photo upload to object storage.
- Choose-one/multi custom question types + required waivers with signature.
- Templates ("duplicate last event"), series management.
- Ticket tiers / early-bird / promo codes.
- Real IAP fee + real accounts (prerequisite for paid go-live).
- Co-organizers, approval-to-join events.

---

## 8. Open questions to confirm before building
1. **Wizard vs one long scroll?** Recommend a **short multi-step wizard** (less overwhelming, better validation). OK?
2. **Recurring events in V1** — include simple "Weekly on {days}", or defer all recurrence to later?
3. **Cover photo in V1** — required, optional, or skip until object storage is wired?
4. **Who can create** — any member (recommended) or Admins/Owners only?
5. **Draft persistence** — local-only for now (fine pre-backend), correct?
6. Anything specific you want emphasized for **non-sport** groups (e.g. clinics, socials, fundraisers) since it's sport-agnostic?

*No code until these are confirmed. This plan extends `PRODUCT_ARCHITECTURE.md` (Events) and folds in `PAID_EVENTS_MODULE.md` (the fee gate lives in the Payment step).*
