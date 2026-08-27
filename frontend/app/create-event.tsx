import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Chip, Ionicons } from "@/src/components/ui";
import { NextUpCard } from "@/src/components/cards";
import { groups, currentUser, EventItem } from "@/src/data/mock";
import { addEvent } from "@/src/data/store";

type Mode = "simple" | "reg_free" | "reg_paid";
const EVENT_TYPES = ["Game", "Practice", "Social", "Meet"] as const;
const DURATIONS = [60, 90, 120, 150];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const CLOSE_OPTS = [
  { h: 24, label: "24h before" },
  { h: 48, label: "2 days before" },
  { h: 168, label: "1 week before" },
];
const COVERS = [
  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=900",
];
const VENUES = [
  { name: "Premier Sports Complex — Field 4", address: "5350 17th St, Sarasota, FL" },
  { name: "Bayfront Courts", address: "5th Ave, Sarasota, FL" },
  { name: "Community Rec Center", address: "1200 Main St, Bradenton, FL" },
];
const PLATFORM_FEE = 4.99;

export default function CreateEventScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();

  const adminGroups = groups.filter((g) => g.role === "Owner" || g.role === "Admin");

  // form state
  const [type, setType] = useState<(typeof EVENT_TYPES)[number]>("Game");
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState(adminGroups[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [dayIdx, setDayIdx] = useState(1);
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(90);
  const [recurrence, setRecurrence] = useState<"none" | "weekly">("none");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<Mode>(params.mode === "paid" ? "reg_paid" : "simple");
  const [capacity, setCapacity] = useState("20");
  const [waitlist, setWaitlist] = useState(true);
  const [closeH, setCloseH] = useState(24);
  const [fields, setFields] = useState<{ id: string; label: string; type: "text" | "toggle" }[]>([]);
  const [price, setPrice] = useState("");
  const [methods, setMethods] = useState({ paypal: true, venmo: true });
  const [refund, setRefund] = useState("");
  const [cover, setCover] = useState(COVERS[0]);
  const [volunteers, setVolunteers] = useState<{ label: string; total: number }[]>([]);
  const [remindersOn, setRemindersOn] = useState(true);

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");

  const group = groups.find((g) => g.id === groupId);
  const isPaid = mode === "reg_paid";
  const isReg = mode !== "simple";

  const steps = useMemo(
    () => ["Basics", "When", "Where", "Participation", ...(isPaid ? ["Payment"] : []), "Extras", "Review"],
    [isPaid],
  );
  const stepName = steps[step];

  const days = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
      }),
    [],
  );
  const times = useMemo(() => {
    const out: string[] = [];
    for (let h = 6; h <= 21; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`);
      out.push(`${String(h).padStart(2, "0")}:30`);
    }
    return out;
  }, []);

  const startISO = useMemo(() => {
    const d = new Date(days[dayIdx]);
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }, [days, dayIdx, time]);

  const fmtTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ap = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
  };

  const canContinue = () => {
    if (stepName === "Basics") return title.trim().length > 1 && !!groupId;
    if (stepName === "Where") return venueName.trim().length > 1;
    if (stepName === "Payment") return Number(price) > 0 && (methods.paypal || methods.venmo);
    return true;
  };

  const buildEvent = (): EventItem => ({
    id: `ce-${Date.now()}`,
    groupId,
    groupName: group?.name ?? "My Group",
    type,
    title: title.trim(),
    start: startISO,
    durationMin: duration,
    venue: venueName.trim(),
    address: venueAddress.trim() || "Sarasota, FL",
    cover,
    rsvp: null,
    goingCount: 0,
    maybeCount: 0,
    capacity: isReg ? Number(capacity) : 0,
    checkedIn: 0,
    weather: { tempF: 80, condition: "Clear", icon: "sunny", precip: 10 },
    volunteersNeeded: volunteers.length ? volunteers.map((v) => ({ label: v.label, filled: 0, total: v.total })) : undefined,
    mode,
    ...(isReg
      ? {
          registration: {
            capacity: Number(capacity),
            deadline: new Date(new Date(startISO).getTime() - closeH * 3600_000).toISOString(),
            waitlistEnabled: waitlist,
            customFields: fields.map((f) => ({ id: f.id, label: f.label || "Question", type: f.type })),
          },
        }
      : {}),
    ...(isPaid ? { paid: { price: Number(price), methods: (Object.keys(methods) as ("paypal" | "venmo")[]).filter((k) => methods[k]) } } : {}),
  });

  const publish = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isPaid) {
      setPhase("processing");
      setTimeout(() => {
        addEvent(buildEvent());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPhase("done");
      }, 1400);
    } else {
      addEvent(buildEvent());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhase("done");
    }
  };

  // ---------- success ----------
  if (phase === "done") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: insets.top, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark-circle" size={52} color={colors.brandPrimary} />
        </View>
        <Txt weight="extrabold" size={22} style={{ marginTop: 20, textAlign: "center" }}>
          Event published!
        </Txt>
        <Txt weight="medium" size={14} color={colors.onSurfaceTertiary} style={{ marginTop: 8, textAlign: "center", lineHeight: 21 }}>
          {`"${title.trim()}" is live for ${group?.name}. Your group has been notified.`}
        </Txt>
        <Pressable testID="create-done-btn" onPress={() => router.replace("/(tabs)/schedule")} style={{ marginTop: 28, height: 52, paddingHorizontal: 32, borderRadius: radius.md, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" }}>
          <Txt weight="bold" size={16} color={colors.onBrandPrimary}>
            View in Schedule
          </Txt>
        </Pressable>
      </View>
    );
  }

  const Section = ({ title: t, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ gap: 10 }}>
      <Txt weight="bold" size={14} color={colors.onSurfaceSecondary}>
        {t}
      </Txt>
      {children}
    </View>
  );
  const input = {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
    fontFamily: "Jakarta-Medium",
    fontSize: 15,
    color: colors.onSurface,
  } as const;

  const scroller = { paddingHorizontal: spacing.xl, paddingTop: 8, paddingBottom: 24, gap: spacing.xl };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header + progress */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable testID="create-back" onPress={() => (step === 0 ? router.back() : setStep((s) => s - 1))} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSecondary, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={step === 0 ? "close" : "chevron-back"} size={20} color={colors.onSurface} />
          </Pressable>
          <Txt weight="bold" size={16}>
            {stepName}
          </Txt>
          <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
            {step + 1}/{steps.length}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", gap: 5, marginTop: 12 }}>
          {steps.map((_, i) => (
            <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? colors.brandPrimary : colors.surfaceTertiary }} />
          ))}
        </View>
      </View>

      <KeyboardAwareScrollView bottomOffset={20} showsVerticalScrollIndicator={false} contentContainerStyle={scroller}>
        {/* ---------------- BASICS ---------------- */}
        {stepName === "Basics" && (
          <>
            <Section title="Event type">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: 44 }}>
                {EVENT_TYPES.map((t) => (
                  <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} testID={`type-${t}`} />
                ))}
              </ScrollView>
            </Section>
            <Section title="Title">
              <TextInput testID="title-input" value={title} onChangeText={setTitle} placeholder="e.g. League Match vs Northgate" placeholderTextColor={colors.onSurfaceTertiary} style={input} />
            </Section>
            <Section title="Group">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: 44 }}>
                {adminGroups.map((g) => (
                  <Chip key={g.id} label={g.name} active={groupId === g.id} onPress={() => setGroupId(g.id)} testID={`group-${g.id}`} />
                ))}
              </ScrollView>
              <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                {group ? `${group.sport} · only admins & owners can create events` : "Select a group you manage"}
              </Txt>
            </Section>
            <Section title="Description (optional)">
              <TextInput testID="desc-input" value={description} onChangeText={setDescription} placeholder="Anything players should know" placeholderTextColor={colors.onSurfaceTertiary} multiline style={[input, { height: 88, paddingTop: 12 }]} />
            </Section>
          </>
        )}

        {/* ---------------- WHEN ---------------- */}
        {stepName === "When" && (
          <>
            <Section title="Date">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: 68 }}>
                {days.map((d, i) => {
                  const active = i === dayIdx;
                  return (
                    <Pressable key={i} testID={`day-${i}`} onPress={() => setDayIdx(i)} style={{ width: 54, height: 64, borderRadius: radius.md, backgroundColor: active ? colors.brandPrimary : colors.surfaceSecondary, borderWidth: active ? 0 : 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <Txt weight="medium" size={11} color={active ? colors.onBrandPrimary : colors.onSurfaceTertiary}>
                        {i === 0 ? "Today" : d.toLocaleDateString([], { weekday: "short" })}
                      </Txt>
                      <Txt weight="extrabold" size={18} color={active ? colors.onBrandPrimary : colors.onSurface}>
                        {d.getDate()}
                      </Txt>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Section>
            <Section title="Start time">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: 44 }}>
                {times.map((t) => (
                  <Chip key={t} label={fmtTime(t)} active={time === t} onPress={() => setTime(t)} testID={`time-${t}`} />
                ))}
              </ScrollView>
            </Section>
            <Section title="Duration">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: 44 }}>
                {DURATIONS.map((d) => (
                  <Chip key={d} label={`${d} min`} active={duration === d} onPress={() => setDuration(d)} testID={`dur-${d}`} />
                ))}
              </ScrollView>
            </Section>
            <Section title="Repeat">
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Chip label="Does not repeat" active={recurrence === "none"} onPress={() => setRecurrence("none")} testID="rep-none" />
                <Chip label="Weekly" active={recurrence === "weekly"} onPress={() => setRecurrence("weekly")} testID="rep-weekly" />
              </View>
              {recurrence === "weekly" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  {WEEKDAYS.map((w, i) => {
                    const on = weekdays.includes(i);
                    return (
                      <Pressable key={i} testID={`wd-${i}`} onPress={() => setWeekdays((p) => (on ? p.filter((x) => x !== i) : [...p, i]))} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: on ? colors.brandPrimary : colors.surfaceSecondary, borderWidth: on ? 0 : 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                        <Txt weight="bold" size={13} color={on ? colors.onBrandPrimary : colors.onSurfaceTertiary}>
                          {w}
                        </Txt>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Section>
          </>
        )}

        {/* ---------------- WHERE ---------------- */}
        {stepName === "Where" && (
          <>
            <Section title="Saved venues">
              <View style={{ gap: 8 }}>
                {VENUES.map((v) => {
                  const active = venueName === v.name;
                  return (
                    <Pressable key={v.name} testID={`venue-${v.name}`} onPress={() => { setVenueName(v.name); setVenueAddress(v.address); }} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: active ? 1.5 : StyleSheet.hairlineWidth, borderColor: active ? colors.brandPrimary : colors.border, padding: 12 }}>
                      <Ionicons name="location" size={18} color={active ? colors.brandPrimary : colors.onSurfaceTertiary} />
                      <View style={{ flex: 1 }}>
                        <Txt weight="semibold" size={14}>{v.name}</Txt>
                        <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>{v.address}</Txt>
                      </View>
                      {active && <Ionicons name="checkmark-circle" size={20} color={colors.brandPrimary} />}
                    </Pressable>
                  );
                })}
              </View>
            </Section>
            <Section title="Or add a venue">
              <TextInput testID="venue-name-input" value={venueName} onChangeText={setVenueName} placeholder="Venue name" placeholderTextColor={colors.onSurfaceTertiary} style={input} />
              <TextInput testID="venue-address-input" value={venueAddress} onChangeText={setVenueAddress} placeholder="Address" placeholderTextColor={colors.onSurfaceTertiary} style={input} />
              <TextInput testID="notes-input" value={notes} onChangeText={setNotes} placeholder="Arrival notes (optional)" placeholderTextColor={colors.onSurfaceTertiary} style={input} />
            </Section>
          </>
        )}

        {/* ---------------- PARTICIPATION ---------------- */}
        {stepName === "Participation" && (
          <>
            <Section title="How do people join?">
              <View style={{ gap: 10 }}>
                {([
                  { k: "simple", t: "RSVP", d: "Quick headcount — Going / Maybe / Can't", icon: "hand-left" },
                  { k: "reg_free", t: "Registration — Free", d: "Reserved spots, capacity & waitlist", icon: "list" },
                  { k: "reg_paid", t: "Registration — Paid", d: "Reserved spots + attendees pay you directly", icon: "card" },
                ] as const).map((o) => {
                  const active = mode === o.k;
                  return (
                    <Pressable key={o.k} testID={`mode-${o.k}`} onPress={() => setMode(o.k)} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: active ? colors.brandTertiary : colors.surfaceSecondary, borderWidth: 1.5, borderColor: active ? colors.brandPrimary : colors.border }}>
                      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: active ? colors.brandPrimary : colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={o.icon} size={20} color={active ? colors.onBrandPrimary : colors.onSurfaceTertiary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt weight="bold" size={15}>{o.t}</Txt>
                        <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>{o.d}</Txt>
                      </View>
                      {active && <Ionicons name="checkmark-circle" size={22} color={colors.brandPrimary} />}
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            {isReg && (
              <>
                <Section title="Capacity & waitlist">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <TextInput testID="capacity-input" value={capacity} onChangeText={(t) => setCapacity(t.replace(/[^0-9]/g, ""))} keyboardType="number-pad" placeholder="20" placeholderTextColor={colors.onSurfaceTertiary} style={[input, { flex: 1 }]} />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>Waitlist</Txt>
                      <Switch testID="waitlist-switch" value={waitlist} onValueChange={setWaitlist} trackColor={{ true: colors.brandPrimary, false: colors.surfaceTertiary }} thumbColor="#fff" />
                    </View>
                  </View>
                </Section>
                <Section title="Close registration">
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {CLOSE_OPTS.map((c) => (
                      <Chip key={c.h} label={c.label} active={closeH === c.h} onPress={() => setCloseH(c.h)} testID={`close-${c.h}`} />
                    ))}
                  </View>
                </Section>
                <Section title="Registration questions (optional)">
                  <View style={{ gap: 8 }}>
                    {fields.map((f, i) => (
                      <View key={f.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <TextInput testID={`qfield-${i}`} value={f.label} onChangeText={(t) => setFields((p) => p.map((x) => (x.id === f.id ? { ...x, label: t } : x)))} placeholder="Question label" placeholderTextColor={colors.onSurfaceTertiary} style={[input, { flex: 1 }]} />
                        <Pressable testID={`qtype-${i}`} onPress={() => setFields((p) => p.map((x) => (x.id === f.id ? { ...x, type: x.type === "text" ? "toggle" : "text" } : x)))} style={{ paddingHorizontal: 10, height: 50, borderRadius: radius.md, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
                          <Txt weight="bold" size={11} color={colors.onSurfaceSecondary}>{f.type === "text" ? "Text" : "Yes/No"}</Txt>
                        </Pressable>
                        <Pressable testID={`qremove-${i}`} onPress={() => setFields((p) => p.filter((x) => x.id !== f.id))} hitSlop={6}>
                          <Ionicons name="close-circle" size={22} color={colors.onSurfaceTertiary} />
                        </Pressable>
                      </View>
                    ))}
                    <Pressable testID="add-question-btn" onPress={() => setFields((p) => [...p, { id: `f${Date.now()}`, label: "", type: "text" }])} style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 14, height: 42, borderRadius: radius.md, borderWidth: 1, borderColor: colors.brandPrimary }}>
                      <Ionicons name="add" size={18} color={colors.brandPrimary} />
                      <Txt weight="bold" size={13} color={colors.brandPrimary}>Add question</Txt>
                    </Pressable>
                  </View>
                </Section>
              </>
            )}
          </>
        )}

        {/* ---------------- PAYMENT ---------------- */}
        {stepName === "Payment" && (
          <>
            <Section title="Price per person ($)">
              <TextInput testID="price-input" value={price} onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ""))} keyboardType="decimal-pad" placeholder="25" placeholderTextColor={colors.onSurfaceTertiary} style={input} />
            </Section>
            <Section title="Accepted methods">
              {(["paypal", "venmo"] as const).map((m) => (
                <Pressable key={m} testID={`method-${m}`} onPress={() => setMethods((p) => ({ ...p, [m]: !p[m] }))} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12 }}>
                  <Ionicons name={m === "paypal" ? "logo-paypal" : "cash"} size={18} color={colors.brandPrimary} />
                  <Txt weight="semibold" size={14} style={{ flex: 1 }}>
                    {m === "paypal" ? currentUser.paymentLinks.paypal : `Venmo ${currentUser.paymentLinks.venmo}`}
                  </Txt>
                  <Ionicons name={methods[m] ? "checkbox" : "square-outline"} size={22} color={methods[m] ? colors.brandPrimary : colors.onSurfaceTertiary} />
                </Pressable>
              ))}
            </Section>
            <Section title="Refund policy (optional)">
              <TextInput testID="refund-input" value={refund} onChangeText={setRefund} placeholder="e.g. Full refund up to 48h before" placeholderTextColor={colors.onSurfaceTertiary} multiline style={[input, { height: 72, paddingTop: 12 }]} />
            </Section>
            <View style={{ flexDirection: "row", gap: 8, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
              <Ionicons name="information-circle" size={18} color={colors.info} />
              <Txt weight="medium" size={12} color={colors.onSurfaceSecondary} style={{ flex: 1 }}>
                Attendees pay you directly. Sideline never processes or holds these payments.
              </Txt>
            </View>
          </>
        )}

        {/* ---------------- EXTRAS ---------------- */}
        {stepName === "Extras" && (
          <>
            <Section title="Cover photo">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {COVERS.map((c) => (
                  <Pressable key={c} testID={`cover-${COVERS.indexOf(c)}`} onPress={() => setCover(c)} style={{ width: "47%", aspectRatio: 1.6, borderRadius: radius.md, overflow: "hidden", borderWidth: cover === c ? 3 : 0, borderColor: colors.brandPrimary, backgroundColor: colors.surfaceTertiary }}>
                    <Image source={{ uri: c }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
                    {cover === c && (
                      <View style={{ position: "absolute", top: 6, right: 6, backgroundColor: colors.brandPrimary, borderRadius: 12, width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="checkmark" size={15} color={colors.onBrandPrimary} />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </Section>
            <Section title="Volunteer slots (optional)">
              <View style={{ gap: 8 }}>
                {volunteers.map((v, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <TextInput testID={`vol-label-${i}`} value={v.label} onChangeText={(t) => setVolunteers((p) => p.map((x, j) => (j === i ? { ...x, label: t } : x)))} placeholder="e.g. Snacks" placeholderTextColor={colors.onSurfaceTertiary} style={[input, { flex: 1 }]} />
                    <Pressable testID={`vol-minus-${i}`} onPress={() => setVolunteers((p) => p.map((x, j) => (j === i ? { ...x, total: Math.max(1, x.total - 1) } : x)))} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="remove" size={18} color={colors.onSurface} />
                    </Pressable>
                    <Txt weight="bold" size={15} mono style={{ width: 20, textAlign: "center" }}>{v.total}</Txt>
                    <Pressable testID={`vol-plus-${i}`} onPress={() => setVolunteers((p) => p.map((x, j) => (j === i ? { ...x, total: x.total + 1 } : x)))} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="add" size={18} color={colors.onSurface} />
                    </Pressable>
                  </View>
                ))}
                <Pressable testID="add-volunteer-btn" onPress={() => setVolunteers((p) => [...p, { label: "", total: 1 }])} style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 14, height: 42, borderRadius: radius.md, borderWidth: 1, borderColor: colors.brandPrimary }}>
                  <Ionicons name="add" size={18} color={colors.brandPrimary} />
                  <Txt weight="bold" size={13} color={colors.brandPrimary}>Add slot</Txt>
                </Pressable>
              </View>
            </Section>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 56 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="notifications" size={18} color={colors.brandPrimary} />
                <Txt weight="semibold" size={14}>Reminders (24h + 2h before)</Txt>
              </View>
              <Switch testID="reminders-switch" value={remindersOn} onValueChange={setRemindersOn} trackColor={{ true: colors.brandPrimary, false: colors.surfaceTertiary }} thumbColor="#fff" />
            </View>
          </>
        )}

        {/* ---------------- REVIEW ---------------- */}
        {stepName === "Review" && (
          <>
            <Txt weight="bold" size={14} color={colors.onSurfaceSecondary}>Preview</Txt>
            <View style={{ marginHorizontal: -spacing.xl }}>
              <NextUpCard event={buildEvent()} />
            </View>
            <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 16, gap: 10 }}>
              <ReviewRow k="Type" v={type} />
              <ReviewRow k="Group" v={group?.name ?? "—"} />
              <ReviewRow k="When" v={`${days[dayIdx].toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${fmtTime(time)}`} />
              <ReviewRow k="Where" v={venueName || "—"} />
              <ReviewRow k="Joining" v={mode === "simple" ? "RSVP" : mode === "reg_free" ? "Free registration" : `Paid · $${price || 0}`} />
              {isReg && <ReviewRow k="Capacity" v={`${capacity}${waitlist ? " + waitlist" : ""}`} />}
              {recurrence === "weekly" && <ReviewRow k="Repeats" v={`Weekly · ${weekdays.length} day(s)`} />}
            </View>
            {isPaid && (
              <View style={{ backgroundColor: colors.brandTertiary, borderRadius: radius.lg, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Txt weight="bold" size={14} color={colors.onBrandTertiary}>Paid-event fee</Txt>
                  <Txt weight="medium" size={12} color={colors.onBrandTertiary}>One-time, via in-app purchase (simulated in preview)</Txt>
                </View>
                <Txt weight="extrabold" size={20} mono color={colors.onBrandTertiary}>${PLATFORM_FEE.toFixed(2)}</Txt>
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>

      {/* Bottom action */}
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.surface }}>
        {stepName !== "Review" ? (
          <Pressable testID="create-continue" onPress={() => { if (canContinue()) { Haptics.selectionAsync(); setStep((s) => s + 1); } }} style={{ height: 54, borderRadius: radius.md, backgroundColor: canContinue() ? colors.brandPrimary : colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
            <Txt weight="bold" size={16} color={canContinue() ? colors.onBrandPrimary : colors.onSurfaceTertiary}>Continue</Txt>
          </Pressable>
        ) : (
          <Pressable testID="create-publish" onPress={publish} disabled={phase === "processing"} style={{ height: 54, borderRadius: radius.md, backgroundColor: colors.brandPrimary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {phase === "processing" ? (
              <ActivityIndicator color={colors.onBrandPrimary} />
            ) : (
              <>
                <Ionicons name={isPaid ? "lock-closed" : "checkmark-circle"} size={19} color={colors.onBrandPrimary} />
                <Txt weight="bold" size={16} color={colors.onBrandPrimary}>{isPaid ? `Pay $${PLATFORM_FEE.toFixed(2)} & Publish` : "Publish Event"}</Txt>
              </>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

// helper
function ReviewRow({ k, v }: { k: string; v: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>{k}</Txt>
      <Txt weight="semibold" size={13} style={{ flex: 1, textAlign: "right" }} numberOfLines={1}>{v}</Txt>
    </View>
  );
}
