import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, Ionicons } from "@/src/components/ui";
import {
  useStore,
  getEvent,
  getCounts,
  getRegistrations,
  confirmPaid,
} from "@/src/data/store";

export default function RosterScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  useStore();
  const event = getEvent(id!);
  if (!event) return <View style={{ flex: 1, backgroundColor: colors.surface }} />;

  const isPaid = event.mode === "reg_paid";
  const price = event.paid?.price ?? 0;
  const counts = getCounts(event.id);
  const regs = getRegistrations(event.id).sort((a, b) => (a.paid === "pending" ? -1 : 1));
  const collected = counts.paid * price;

  const Stat = ({ v, l, c }: { v: string; l: string; c?: string }) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Txt weight="extrabold" size={20} mono color={c ?? colors.onSurface}>
        {v}
      </Txt>
      <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
        {l}
      </Txt>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <Pressable testID="roster-back" onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Txt weight="bold" size={17} numberOfLines={1}>
            Registrations
          </Txt>
          <Txt weight="medium" size={12} color={colors.onSurfaceTertiary} numberOfLines={1}>
            {event.title}
          </Txt>
        </View>
      </View>

      <ScrollView testID="roster-scroll" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.xl, paddingBottom: insets.bottom + 24, gap: 16 }}>
        {/* Summary */}
        <View style={{ flexDirection: "row", backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingVertical: 16 }}>
          <Stat v={`${counts.registered}`} l="Registered" />
          <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          {isPaid ? (
            <>
              <Stat v={`${counts.paid}`} l="Paid" c={colors.success} />
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
              <Stat v={`$${collected}`} l="Collected" c={colors.brandPrimary} />
            </>
          ) : (
            <Stat v={`${counts.waitlisted}`} l="Waitlist" />
          )}
        </View>

        {isPaid && (
          <View style={{ flexDirection: "row", gap: 8, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
            <Ionicons name="information-circle" size={18} color={colors.info} />
            <Txt weight="medium" size={12} color={colors.onSurfaceSecondary} style={{ flex: 1 }}>
              {`You collect payments directly (PayPal/Venmo). Tap "Confirm" once you've received a payment. Totals are for your reference only.`}
            </Txt>
          </View>
        )}

        {/* List */}
        <View style={{ gap: 10 }}>
          {regs.map((r) => (
            <View key={r.id} testID={`roster-row-${r.id}`} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12 }}>
              <Avatar uri={r.avatar} size={40} />
              <View style={{ flex: 1 }}>
                <Txt weight="bold" size={14}>
                  {r.name}{r.isMe ? " (You)" : ""}
                </Txt>
                <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                  {r.status === "waitlisted" ? "Waitlisted" : "Registered"}
                  {isPaid && r.method ? ` · ${r.method === "paypal" ? "PayPal" : "Venmo"}` : ""}
                </Txt>
              </View>
              {isPaid && (
                r.paid === "confirmed" ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.success, paddingHorizontal: 10, height: 30, borderRadius: 15 }}>
                    <Ionicons name="checkmark" size={14} color={colors.onSuccess} />
                    <Txt weight="bold" size={12} color={colors.onSuccess}>
                      Paid
                    </Txt>
                  </View>
                ) : (
                  <Pressable
                    testID={`confirm-paid-${r.id}`}
                    onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); confirmPaid(r.id); }}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.brandPrimary, paddingHorizontal: 12, height: 32, borderRadius: 16 }}
                  >
                    <Ionicons name="cash" size={14} color={colors.onBrandPrimary} />
                    <Txt weight="bold" size={12} color={colors.onBrandPrimary}>
                      Confirm
                    </Txt>
                  </Pressable>
                )
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
