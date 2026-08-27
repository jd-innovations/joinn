// Lightweight in-memory store for the Registered/Paid Events module (mock build).
// Syncs registration + payment state across screens via useSyncExternalStore.
// No backend — replace with API calls once auth/backend exist.

import { useSyncExternalStore } from "react";
import { members, currentUser, events as seedEvents, EventItem } from "./mock";

export type PaymentState = "pending" | "confirmed";
export type RegStatus = "registered" | "waitlisted";

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  avatar: string;
  status: RegStatus;
  isMe?: boolean;
  paid?: PaymentState; // only for paid events
  method?: "paypal" | "venmo";
  reference?: string;
  formResponses?: Record<string, string>;
  createdAt: number;
}

const ME_ID = "me";

// --- seed some existing registrations so paid-event rosters feel alive ---
function seed(): Registration[] {
  const regs: Registration[] = [];
  const seedFor = (eventId: string, count: number, paidRatio: number) => {
    for (let i = 0; i < count; i++) {
      const m = members[(i + 1) % members.length];
      regs.push({
        id: `${eventId}-r${i}`,
        eventId,
        userId: m.id,
        name: m.name,
        avatar: m.avatar,
        status: "registered",
        paid: i / count < paidRatio ? "confirmed" : "pending",
        method: i % 2 === 0 ? "venmo" : "paypal",
        createdAt: Date.now() - i * 60000,
      });
    }
  };
  seedFor("e5", 14, 0.7);
  seedFor("e6", 21, 0.8);
  return regs;
}

let registrations: Registration[] = seed();
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// --- selectors ---
export function getRegistrations(eventId: string): Registration[] {
  return registrations.filter((r) => r.eventId === eventId);
}

export function getMyRegistration(eventId: string): Registration | undefined {
  return registrations.find((r) => r.eventId === eventId && r.userId === ME_ID);
}

export function getCounts(eventId: string) {
  const list = getRegistrations(eventId);
  const registered = list.filter((r) => r.status === "registered").length;
  const waitlisted = list.filter((r) => r.status === "waitlisted").length;
  const paid = list.filter((r) => r.paid === "confirmed").length;
  const pending = list.filter((r) => r.paid === "pending").length;
  return { registered, waitlisted, paid, pending, total: list.length };
}

// --- mutations ---
export function register(
  eventId: string,
  capacity: number,
  formResponses?: Record<string, string>,
): Registration {
  const existing = getMyRegistration(eventId);
  if (existing) return existing;
  const { registered } = getCounts(eventId);
  const status: RegStatus = registered >= capacity ? "waitlisted" : "registered";
  const reg: Registration = {
    id: `${eventId}-me-${Date.now()}`,
    eventId,
    userId: ME_ID,
    name: currentUser.name,
    avatar: currentUser.avatar,
    status,
    isMe: true,
    createdAt: Date.now(),
    formResponses,
  };
  registrations = [...registrations, reg];
  emit();
  return reg;
}

export function cancelRegistration(eventId: string) {
  registrations = registrations.filter(
    (r) => !(r.eventId === eventId && r.userId === ME_ID),
  );
  // promote first waitlisted
  const wl = registrations.find((r) => r.eventId === eventId && r.status === "waitlisted");
  if (wl) wl.status = "registered";
  emit();
}

export function markPaid(eventId: string, method: "paypal" | "venmo", reference?: string) {
  const reg = getMyRegistration(eventId);
  if (reg) {
    reg.paid = "pending";
    reg.method = method;
    reg.reference = reference;
    emit();
  }
}

export function confirmPaid(registrationId: string) {
  const reg = registrations.find((r) => r.id === registrationId);
  if (reg) {
    reg.paid = "confirmed";
    emit();
  }
}

// --- created paid events (organizer side, our monetization) ---
export interface CreatedPaidEvent {
  id: string;
  title: string;
  price: number;
  feePaid: boolean;
  createdAt: number;
}
let createdPaidEvents: CreatedPaidEvent[] = [];
export function getCreatedPaidEvents() {
  return createdPaidEvents;
}
export function publishPaidEvent(title: string, price: number) {
  createdPaidEvents = [
    ...createdPaidEvents,
    { id: `cpe-${Date.now()}`, title, price, feePaid: true, createdAt: Date.now() },
  ];
  emit();
}

// --- events created via the wizard (local session) ---
let createdEvents: EventItem[] = [];

// Convenience: event lookup (seed + created)
export function getEvent(id: string) {
  return createdEvents.find((e) => e.id === id) ?? seedEvents.find((e) => e.id === id);
}

export function addEvent(evt: EventItem) {
  createdEvents = [evt, ...createdEvents];
  emit();
}
export function getAllEvents(): EventItem[] {
  return [...createdEvents, ...seedEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}

// --- create-event draft (session-local) ---
let draftEvent: Record<string, unknown> | null = null;
export function getDraft() {
  return draftEvent;
}
export function setDraft(d: Record<string, unknown> | null) {
  draftEvent = d;
}
export function clearDraft() {
  draftEvent = null;
}

// Hook — subscribe components to store changes.
export function useStore(): number {
  return useSyncExternalStore(subscribe, () => version, () => version);
}
