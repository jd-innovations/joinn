import React, { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Ionicons } from "@/src/components/ui";

const WD = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ---------------- Calendar ---------------- */
export function Calendar({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const { colors, radius } = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState({ y: value.getFullYear(), m: value.getMonth() });

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = first.getDay();
    const daysIn = new Date(view.y, view.m + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= daysIn; d++) out.push(new Date(view.y, view.m, d));
    return out;
  }, [view]);

  const shift = (delta: number) => {
    const m = view.m + delta;
    const d = new Date(view.y, m, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Pressable testID="cal-prev" onPress={() => shift(-1)} hitSlop={8} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={18} color={colors.onSurface} />
        </Pressable>
        <Txt weight="bold" size={15}>
          {MONTHS[view.m]} {view.y}
        </Txt>
        <Pressable testID="cal-next" onPress={() => shift(1)} hitSlop={8} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-forward" size={18} color={colors.onSurface} />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        {WD.map((w, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Txt weight="bold" size={11} color={colors.onSurfaceTertiary}>
              {w}
            </Txt>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((d, i) => {
          if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: 42 }} />;
          const selected = sameDay(d, value);
          const disabled = d < today;
          return (
            <View key={i} style={{ width: `${100 / 7}%`, height: 42, alignItems: "center", justifyContent: "center" }}>
              <Pressable
                testID={`cal-day-${d.getDate()}`}
                disabled={disabled}
                onPress={() => {
                  const nd = new Date(value);
                  nd.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                  onChange(nd);
                }}
                style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: selected ? colors.brandPrimary : "transparent" }}
              >
                <Txt weight={selected ? "bold" : "medium"} size={14} color={selected ? colors.onBrandPrimary : disabled ? colors.onSurfaceTertiary : colors.onSurface} style={{ opacity: disabled ? 0.4 : 1 }}>
                  {d.getDate()}
                </Txt>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------- Wheel ---------------- */
const ITEM_H = 40;
function Wheel({ items, index, onIndex, testID }: { items: string[]; index: number; onIndex: (i: number) => void; testID?: string }) {
  const { colors } = useTheme();
  const ref = useRef<ScrollView>(null);
  const last = useRef(index);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.max(0, Math.min(items.length - 1, Math.round(e.nativeEvent.contentOffset.y / ITEM_H)));
    if (i !== last.current) {
      last.current = i;
      onIndex(i);
    }
  };

  return (
    <View style={{ height: ITEM_H * 5, flex: 1 }}>
      <ScrollView
        ref={ref}
        testID={testID}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentOffset={{ x: 0, y: index * ITEM_H }}
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
      >
        {items.map((it, i) => (
          <View key={i} style={{ height: ITEM_H, alignItems: "center", justifyContent: "center" }}>
            <Txt weight={i === index ? "bold" : "medium"} size={i === index ? 20 : 17} mono color={i === index ? colors.onSurface : colors.onSurfaceTertiary}>
              {it}
            </Txt>
          </View>
        ))}
      </ScrollView>
      {/* center highlight */}
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: ITEM_H * 2, height: ITEM_H, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }} />
    </View>
  );
}

/* ---------------- Time picker ---------------- */
export function TimePicker({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const { colors, radius } = useTheme();
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const periods = ["AM", "PM"];

  const h24 = value.getHours();
  const hIdx = (h24 % 12 === 0 ? 12 : h24 % 12) - 1;
  const mIdx = value.getMinutes();
  const pIdx = h24 >= 12 ? 1 : 0;

  const commit = (nh: number, nm: number, np: number) => {
    let hour = nh + 1; // 1..12
    if (np === 1) hour = hour === 12 ? 12 : hour + 12;
    else hour = hour === 12 ? 0 : hour;
    const d = new Date(value);
    d.setHours(hour, nm, 0, 0);
    onChange(d);
  };

  return (
    <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingVertical: 8, flexDirection: "row", alignItems: "center" }}>
      <Wheel testID="wheel-hour" items={hours} index={hIdx} onIndex={(i) => commit(i, mIdx, pIdx)} />
      <Txt weight="bold" size={20}>:</Txt>
      <Wheel testID="wheel-minute" items={minutes} index={mIdx} onIndex={(i) => commit(hIdx, i, pIdx)} />
      <Wheel testID="wheel-period" items={periods} index={pIdx} onIndex={(i) => commit(hIdx, mIdx, i)} />
    </View>
  );
}

export function formatDateLong(d: Date) {
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
export function formatClock(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
