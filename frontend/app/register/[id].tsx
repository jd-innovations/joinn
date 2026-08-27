import React, { useState } from "react";
import { View, Pressable, StyleSheet, TextInput, Switch, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Tag, Ionicons } from "@/src/components/ui";
import { currentUser, formatEventTime } from "@/src/data/mock";
import {
  useStore,
  getEvent,
  getCounts,
  getMyRegistration,
  register,
  cancelRegistration,
  markPaid,
} from "@/src/data/store";

export default function RegisterScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  useStore();
  const event = getEvent(id!);
  const [form, setForm] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");

  if (!event || !event.registration) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }} />
    );
  }

  const reg = getMyRegistration(event.id);
  const counts = getCounts(event.id);
  const spotsLeft = Math.max(0, event.registration.capacity - counts.registered);
  const isPaid = event.mode === "reg_paid";
  const price = event.paid?.price ?? 0;

  const doRegister = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    register(event.id, event.registration!.capacity, form);
  };

  const openPay = (method: "paypal" | "venmo") => {
    const links = currentUser.paymentLinks;
    let url = "";
    const note = encodeURIComponent(`${event.title} registration`);
    if (method === "paypal") {
      const handle = links.paypal.replace(/^paypal\.me\//, "");
      url = `https://paypal.me/${handle}/${price}`;
    } else {
      const handle = links.venmo.replace(/^@/, "");
      url = `https://venmo.com/u/${handle}?txn=pay&amount=${price}&note=${note}`;
    }
    Linking.openURL(url).catch(() => {});
    markPaid(event.id, method, reference || undefined);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <Pressable testID="register-back" onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.onSurface} />
        </Pressable>
        <Txt weight="bold" size={18}>
          {isPaid ? "Register & Pay" : "Register"}
        </Txt>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: insets.bottom + 40, gap: spacing.xl }}
      >
        {/* Event summary */}
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Tag label={isPaid ? "Paid Event" : "Registration"} tone={isPaid ? "warning" : "brand"} />
            <Txt weight="semibold" size={13} color={colors.onSurfaceTertiary}>
              {event.groupName}
            </Txt>
          </View>
          <Txt weight="extrabold" size={22}>
            {event.title}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Ionicons name="calendar-outline" size={14} color={colors.brandPrimary} />
            <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>
              {formatEventTime(event.start)}
            </Txt>
          </View>
        </View>

        {/* Spots + price */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 14 }}>
            <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
              Spots left
            </Txt>
            <Txt weight="extrabold" size={22} mono color={spotsLeft > 0 ? colors.brandPrimary : colors.warning}>
              {spotsLeft}/{event.registration.capacity}
            </Txt>
          </View>
          {isPaid && (
            <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 14 }}>
              <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                Price
              </Txt>
              <Txt weight="extrabold" size={22} mono color={colors.onSurface}>
                ${price}
              </Txt>
            </View>
          )}
        </View>

        {/* Custom fields */}
        {!reg && event.registration.customFields.length > 0 && (
          <View style={{ gap: 14 }}>
            <Txt weight="extrabold" size={16}>
              Registration details
            </Txt>
            {event.registration.customFields.map((f) => (
              <View key={f.id}>
                {f.type === "toggle" ? (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 54 }}>
                    <Txt weight="semibold" size={14}>
                      {f.label}
                    </Txt>
                    <Switch
                      testID={`field-${f.id}`}
                      value={form[f.id] === "yes"}
                      onValueChange={(v) => setForm((p) => ({ ...p, [f.id]: v ? "yes" : "no" }))}
                      trackColor={{ true: colors.brandPrimary, false: colors.surfaceTertiary }}
                      thumbColor="#fff"
                    />
                  </View>
                ) : (
                  <View>
                    <Txt weight="medium" size={13} color={colors.onSurfaceSecondary} style={{ marginBottom: 6 }}>
                      {f.label}
                    </Txt>
                    <TextInput
                      testID={`field-${f.id}`}
                      value={form[f.id] ?? ""}
                      onChangeText={(t) => setForm((p) => ({ ...p, [f.id]: t }))}
                      placeholder="Type here"
                      placeholderTextColor={colors.onSurfaceTertiary}
                      style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 50, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Registered status */}
        {reg && (
          <View style={{ backgroundColor: colors.brandTertiary, borderRadius: radius.lg, padding: 16, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name={reg.status === "waitlisted" ? "hourglass" : "checkmark-circle"} size={20} color={colors.brandPrimary} />
              <Txt weight="bold" size={16} color={colors.onBrandTertiary}>
                {reg.status === "waitlisted" ? "You're on the waitlist" : "You're registered!"}
              </Txt>
            </View>
            <Txt weight="medium" size={13} color={colors.onBrandTertiary}>
              {reg.status === "waitlisted"
                ? "We'll notify you if a spot opens up."
                : isPaid
                  ? "Complete payment below to secure your spot."
                  : "See you there. You can cancel anytime before the deadline."}
            </Txt>
          </View>
        )}

        {/* Payment section (paid + registered) */}
        {reg && isPaid && (
          <View style={{ gap: 12 }}>
            <Txt weight="extrabold" size={16}>
              Pay the organizer ${price}
            </Txt>
            <View style={{ flexDirection: "row", gap: 8, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
              <Ionicons name="information-circle" size={18} color={colors.info} />
              <Txt weight="medium" size={12} color={colors.onSurfaceSecondary} style={{ flex: 1 }}>
                Payment goes directly to the organizer. Sideline does not process this payment.
              </Txt>
            </View>

            {reg.paid ? (
              <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: 1.5, borderColor: reg.paid === "confirmed" ? colors.success : colors.warning, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name={reg.paid === "confirmed" ? "shield-checkmark" : "time"} size={24} color={reg.paid === "confirmed" ? colors.success : colors.warning} />
                <View style={{ flex: 1 }}>
                  <Txt weight="bold" size={15}>
                    {reg.paid === "confirmed" ? "Payment confirmed" : "Payment pending confirmation"}
                  </Txt>
                  <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                    {reg.paid === "confirmed"
                      ? `Paid via ${reg.method === "paypal" ? "PayPal" : "Venmo"} — spot secured`
                      : `You marked as paid via ${reg.method === "paypal" ? "PayPal" : "Venmo"}. Awaiting organizer.`}
                  </Txt>
                </View>
              </View>
            ) : (
              <>
                <TextInput
                  testID="payment-reference"
                  value={reference}
                  onChangeText={setReference}
                  placeholder="Payment note / reference (optional)"
                  placeholderTextColor={colors.onSurfaceTertiary}
                  style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 50, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
                />
                {event.paid?.methods.includes("paypal") && (
                  <Pressable testID="pay-paypal" onPress={() => openPay("paypal")} style={{ height: 54, borderRadius: radius.md, backgroundColor: "#003087", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Ionicons name="logo-paypal" size={20} color="#fff" />
                    <Txt weight="bold" size={15} color="#fff">
                      Pay with PayPal
                    </Txt>
                  </Pressable>
                )}
                {event.paid?.methods.includes("venmo") && (
                  <Pressable testID="pay-venmo" onPress={() => openPay("venmo")} style={{ height: 54, borderRadius: radius.md, backgroundColor: "#008CFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Ionicons name="cash" size={20} color="#fff" />
                    <Txt weight="bold" size={15} color="#fff">
                      Pay with Venmo
                    </Txt>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}
      </KeyboardAwareScrollView>

      {/* Bottom action */}
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.surface }}>
        {!reg ? (
          <Pressable testID="register-btn" onPress={doRegister} style={{ height: 54, borderRadius: radius.md, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
            <Ionicons name="create" size={20} color={colors.onBrandPrimary} />
            <Txt weight="bold" size={16} color={colors.onBrandPrimary}>
              {spotsLeft > 0 ? (isPaid ? `Register — then pay $${price}` : "Confirm Registration") : "Join Waitlist"}
            </Txt>
          </Pressable>
        ) : (
          <Pressable testID="cancel-registration-btn" onPress={() => { cancelRegistration(event.id); router.back(); }} style={{ height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
            <Txt weight="bold" size={15} color={colors.error}>
              Cancel Registration
            </Txt>
          </Pressable>
        )}
      </View>
    </View>
  );
}
