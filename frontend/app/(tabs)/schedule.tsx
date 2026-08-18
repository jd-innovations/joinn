import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, ChipRow } from "@/src/components/ui";
import { ScheduleCard } from "@/src/components/cards";
import { events as seedEvents, EventItem } from "@/src/data/mock";

const FILTERS = [
  { key: "all", label: "All Teams" },
  { key: "Game", label: "Games" },
  { key: "Practice", label: "Practices" },
  { key: "Social", label: "Social" },
  { key: "Meet", label: "Meets" },
];

function DateStrip() {
  const { colors, radius } = useTheme();
  const [sel, setSel] = useState(0);
  const days = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }} style={{ maxHeight: 72 }}>
      {days.map((d, i) => {
        const active = i === sel;
        return (
          <Pressable
            key={i}
            testID={`date-chip-${i}`}
            onPress={() => setSel(i)}
            style={{
              width: 52,
              height: 64,
              borderRadius: radius.md,
              backgroundColor: active ? colors.brandPrimary : colors.surfaceSecondary,
              borderWidth: active ? 0 : 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Txt weight="medium" size={11} color={active ? colors.onBrandPrimary : colors.onSurfaceTertiary}>
              {d.toLocaleDateString([], { weekday: "short" })}
            </Txt>
            <Txt weight="extrabold" size={18} color={active ? colors.onBrandPrimary : colors.onSurface}>
              {d.getDate()}
            </Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default function ScheduleScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<EventItem[]>(seedEvents);

  const filtered = events.filter((e) => filter === "all" || e.type === filter);

  const setRSVP = (id: string, v: "going" | "maybe" | "no") => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, rsvp: v } : e)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ paddingTop: insets.top + 8, backgroundColor: colors.surface, gap: 14 }}>
        <View style={{ paddingHorizontal: spacing.xl, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Txt weight="extrabold" size={28}>
            Schedule
          </Txt>
        </View>
        <DateStrip />
        <ChipRow items={FILTERS} activeKey={filter} onChange={setFilter} testIDPrefix="schedule-filter" />
      </View>

      <ScrollView
        testID="schedule-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 14, paddingBottom: insets.bottom + 100, gap: 12 }}
      >
        {filtered.map((e) => (
          <ScheduleCard
            key={e.id}
            event={e}
            onPress={() => router.push(`/event/${e.id}`)}
            onRSVP={(v) => setRSVP(e.id, v)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
