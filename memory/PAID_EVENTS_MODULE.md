# Module Plan — Registered & Paid Events
### "Sideline" · planning only (no code)

> Extends the existing Events module. Today an event only supports lightweight RSVP
> (Going / Maybe / Can't). This adds **registration-required events** and **paid events**,
> where organizers collect money **directly** via their own payment link (PayPal / Venmo /
> Cash App / Zelle) and the platform **never processes or holds attendee money**. Our revenue
> comes from a **fee charged to organizers for creating paid events**.

---

## 0. Locked Decisions (V1)

| # | Decision | Choice |
|---|---|---|
| 1 | Our monetization | **Per-event creation fee only** (no subscription in V1) |
| 2 | Compliance path | **Path 1** — creation fee via **in-app purchase (RevenueCat consumable)**; accept store commission |
| 3 | Attendee payment methods | **PayPal + Venmo** at launch (Cash App / Zelle later) |
| 4 | Payment verification | **Honor system** (attendee marks paid → organizer confirms); no payment APIs in V1 |
| 5 | Auth / accounts | **Deferred.** Build flows on current mock/organizer identity now; real accounts are a prerequisite before production launch of paid events |

**Consequences of these choices:**
- No "Pro Organizer" subscription in V1 — every paid event incurs the per-event fee.
- The per-event fee is a **store consumable IAP** → it **only works on a real deployed build (not Expo Go / web preview)** and requires the RevenueCat integration (route via integration_expert at build time).
- Attendee→organizer money stays fully off-app (PayPal/Venmo deep links) — compliant, no store commission.
- Because auth is deferred, a near-term build is a **UI/flow build on mock data**; roster ownership, payment-link storage, and fee receipts become real once accounts exist.

---


## 1. Goals & Non-Goals

**Goals**
- Let organizers require **registration** (not just a casual RSVP) with capacity, a deadline, and optional custom questions/waivers.
- Support **free** registration and **paid** registration events.
- For paid events, route the attendee to the **organizer's own payment link** (PayPal.me, Venmo, Cash App $cashtag, Zelle). Payment happens **off-app, peer-to-peer** — we don't touch it.
- Monetize by charging the **organizer a platform fee to create a paid event** (our only real transaction).

**Non-Goals (explicitly out of scope)**
- We do **not** process, hold, escrow, split, or refund attendee payments.
- We do **not** guarantee a spot is paid — the organizer confirms/settles payment themselves.
- No ticket scanning/barcodes in V1 (Check-In already covers attendance).

---

## 2. Three event modes (progressive disclosure)

The organizer picks a mode when creating an event. Everything below "Simple" is opt-in, so casual events stay one-tap simple.

| Mode | Attendee action | Capacity/waitlist | Money | Our fee |
|---|---|---|---|---|
| **Simple RSVP** (today) | Going / Maybe / Can't | optional cap | none | free |
| **Registration — Free** | Register (name + optional form) | cap + waitlist | none | free |
| **Registration — Paid** | Register → pay organizer via their link | cap + waitlist | attendee → organizer, off-app | **paid: platform creation fee** |

Key distinction: **RSVP = a soft intention. Registration = a committed, tracked spot** (with a form/roster, capacity enforcement, and — if paid — a payment status).

---

## 3. Attendee experience

### 3.1 Free registration
1. Open event → sees "Registration required · X of N spots left · closes {date}".
2. Tap **Register** → fills any custom fields the organizer added (e.g., shirt size, emergency contact, waiver checkbox).
3. Confirmed → gets a spot; if full → joins **waitlist** and is auto-notified if a spot frees up.
4. Can **cancel registration** before the deadline (frees the spot / promotes waitlist).

### 3.2 Paid registration
1. Same as above, then a **payment step**:
   - Screen clearly states: *"Payment goes directly to the organizer. Sideline does not process this payment."*
   - Shows amount + the organizer's chosen method(s): **PayPal / Venmo / Cash App / Zelle**.
   - Tapping a method **opens that app or web link** (deep link e.g. `venmo://` or `https://paypal.me/...`) — opens in the external browser/app, never an in-app webview.
   - Attendee pays there, returns, and **marks "I've paid"** (optionally pasting a reference/last-4 or note).
2. Their status becomes **"Registered · Payment pending confirmation."**
3. Organizer later **confirms received** → status **"Registered · Paid ✓."**
4. Spot is "held" during a configurable window (e.g., 24h) so unpaid registrations don't block real attendees; if unconfirmed past the window → spot may auto-release (organizer setting).

**Honor-system model** (V1): because we don't process money, payment state is a shared, transparent ledger between attendee ("I paid") and organizer ("confirmed"). This is the same pattern used by many league/club tools and is App Store compliant for in-person events.

---

## 4. Organizer experience

### 4.1 Setup (one-time)
- **Payment links** saved to the organizer profile: PayPal.me URL, Venmo handle, Cash App $cashtag, Zelle email/phone. Reused across events. Validated for basic format only.

### 4.2 Creating a paid event (this is where WE earn)
1. Toggle event to **Registration → Paid**.
2. Set **price**, capacity, deadline, refund policy text (free-form, enforced by organizer), custom form fields.
3. Choose which of their saved payment links to show.
4. **Platform fee gate:** before publishing a paid event, organizer pays Sideline's **paid-event creation fee** (see §6). Free/RSVP events skip this entirely.

### 4.3 Managing registrations
- **Registration roster**: who registered, form answers, payment status (Pending / Paid / Refunded-by-organizer).
- One-tap **Confirm paid** / **Mark refunded** / **Message registrant**.
- Live counts: registered, paid, waitlisted, revenue-collected (organizer's own tally, informational only).
- Export/share roster.

---

## 5. Data model additions (conceptual)

- `Event.mode`: `simple | registration_free | registration_paid`
- `Event.registration`: `{ capacity, waitlistEnabled, deadline, customFields[], refundPolicyText, holdWindowHrs }`
- `Event.paid`: `{ price, currency, acceptedMethods[], platformFeeStatus }`
- `Registration`: `{ id, eventId, userId, status: registered|waitlisted|cancelled, formResponses, createdAt }`
- `PaymentClaim` (paid only): `{ registrationId, method, attendeeMarkedPaidAt, reference?, organizerConfirmedAt?, state: pending|confirmed|disputed|refunded }`
- `OrganizerPaymentLinks`: `{ paypal?, venmo?, cashapp?, zelle? }` on the user/organizer profile.
- `PlatformFeeCharge`: `{ organizerId, eventId, amount, provider, state, createdAt }` — our billing record.

All money fields on `PaymentClaim` are **informational** (we don't move funds). The only real charge we track is `PlatformFeeCharge`.

---

## 6. Monetization — the paid-event creation fee (our only real payment)

This is the one place actual money flows **to us**, so it needs a real, compliant processor. Options:

| Model | How it works | Pros | Cons |
|---|---|---|---|
| **A. Per-event flat fee** | e.g. $4.99 to publish a paid event | Simple, pay-as-you-go | Friction on each event |
| **B. % of expected gross** | e.g. 3% × price × capacity, capped | Scales with value | We can't verify actual collections (off-app) → must estimate |
| **C. Organizer subscription** | "Pro Organizer" unlocks unlimited paid events | Predictable MRR, best UX | Higher commit; needs tiering |
| **D. Credits/bundles** | Buy 5 paid-event credits | Bulk discount | Extra concept |

**Recommendation:** **A + C** — a per-event fee for casual organizers, and a **Pro Organizer subscription** that waives it for power users. Model B is discouraged because we can't see off-app collections.

### 6.1 CRITICAL — App Store / Play Store compliance (validated 2026)
This is the make-or-break detail:
- ✅ **Attendee → organizer payments** for **in-person events** are a *real-world service consumed outside the app*. Apple 3.1.3(e) and Google both **allow external methods (PayPal/Venmo)** here with **no IAP and no store commission**. Our model is safe.
- ⚠️ **Our creation fee / Pro subscription** unlocks a **digital feature inside the app** → the stores generally treat this as a **digital service requiring IAP/Play Billing (15–30%)**. Charging the organizer via a card/Stripe *inside the app* risks rejection.
  - **Path 1 (recommended, compliant):** charge the creation fee / subscription through **in-app purchase**: the subscription via **RevenueCat (auto-renewable)**, and per-event fees via a **store consumable IAP**. Accept the store commission as cost of doing business.
  - **Path 2:** collect the fee **off-app on the web** (organizer pays on a Sideline web dashboard, then creates paid events on mobile). Avoids commission but adds friction and must not link out for it inside the iOS app (except under US external-link / EU entitlement programs).
  - **Decision needed** before build. Default assumption for planning: **Path 1** (RevenueCat subscription + consumable per-event fee).
- 🔒 **Never** open payment links in an in-app webview — always the external browser/app. Always show the "payment handled by organizer, not Sideline" disclosure.

---

## 7. Navigation & UX changes (no new tab)
- **Event create flow**: add a "Type" step → Simple / Registration (Free) / Registration (Paid).
- **Event detail**: RSVP control is **replaced by a Register / Pay CTA** when the event is a registration event; shows spots-left, deadline, and payment status chip.
- **Me / Organizer**: new "Payment links" setting; "My paid events" with rosters.
- **Wallet**: paid-event creation-fee receipts can live here alongside coupons.
- Simple events are visually unchanged — depth only appears when the organizer opts in.

---

## 8. Trust, safety & legal
- Prominent, repeated disclaimer: **Sideline does not process, hold, or guarantee attendee payments; all payments and refunds are handled directly between organizer and attendee.**
- Dispute handling is **off-app**; we provide a "Report a problem" that flags the organizer, not a chargeback.
- Store organizer payment links but **validate format only**; never store attendee card/bank data (we never see it).
- Add ToS language covering organizer responsibility, refunds, and tax (organizers are responsible for their own taxes/1099s — we don't issue them since we don't move their funds).

---

## 9. V1 vs. Future

**V1**
- Three event modes; free + paid registration.
- Capacity, waitlist, deadline, custom form fields, cancel/waitlist-promotion.
- Organizer payment links (PayPal/Venmo/Cash App/Zelle) + external deep-link open.
- Honor-system payment claim → organizer confirm.
- Registration roster + payment-status management.
- Platform monetization: **per-event creation fee + Pro Organizer subscription** (via IAP/RevenueCat — Path 1).

**Future**
- QR/barcode tickets & scan check-in (ties into existing Check-In).
- Automatic payment verification via optional PayPal/Venmo API confirmation (moves beyond honor system).
- Promo codes / early-bird pricing / tiered ticket types.
- Group/family registrations, transfer a spot.
- Organizer payouts dashboard & revenue analytics.
- Refund-request workflow (still settled off-app).
- Real payment processing option (Stripe Connect) *if* we ever decide to actually handle funds — a major scope/regulatory change, deliberately deferred.

---

## 10. Open questions to confirm before build
1. **Monetization shape:** per-event fee, Pro subscription, or both? Suggested price points?
2. **Compliance path:** Path 1 (IAP/RevenueCat, accept commission) vs Path 2 (web-collected fee)? This drives the whole build.
3. **Payment methods for V1:** all four (PayPal, Venmo, Cash App, Zelle) or start with PayPal + Venmo?
4. **Payment verification:** honor-system only in V1 (recommended), or attempt API-based confirmation now?
5. **Refund stance:** display organizer's policy text only, or add a structured refund-request flow?
6. **Auth dependency:** paid events realistically need real user accounts + an organizer identity (currently the app uses mock/anonymous data). Confirm we'll add accounts as a prerequisite.

*No code will be written until these are decided. This plan updates the product architecture; the Events module in `PRODUCT_ARCHITECTURE.md` should reference this document.*
