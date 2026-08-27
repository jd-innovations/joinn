import React, { useState } from "react";
import { View, Pressable, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Ionicons } from "@/src/components/ui";
import { currentUser } from "@/src/data/mock";
import { publishPaidEvent } from "@/src/data/store";

const PLATFORM_FEE = 4.99;

export default function PaidEventFeeScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  const canPublish = title.trim().length > 2 && Number(price) > 0;

  const pay = () => {
    if (!canPublish) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus("processing");
    // Simulated in-app purchase. On a real device build this is charged via
    // RevenueCat (App Store / Play billing). Not testable in Expo Go / web.
    setTimeout(() => {
      publishPaidEvent(title.trim(), Number(price));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatus("done");
    }, 1400);
  };

  if (status === "done") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: insets.top, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark-circle" size={52} color={colors.brandPrimary} />
        </View>
        <Txt weight="extrabold" size={22} style={{ marginTop: 20, textAlign: "center" }}>
          Paid event published
        </Txt>
        <Txt weight="medium" size={14} color={colors.onSurfaceTertiary} style={{ marginTop: 8, textAlign: "center", lineHeight: 21 }}>
          {`"${title.trim()}" is live at $${Number(price)} per person. Attendees will pay you directly via PayPal or Venmo.`}
        </Txt>
        <Pressable testID="fee-done-btn" onPress={() => router.back()} style={{ marginTop: 28, height: 52, paddingHorizontal: 32, borderRadius: radius.md, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" }}>
          <Txt weight="bold" size={16} color={colors.onBrandPrimary}>
            Done
          </Txt>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Txt weight="extrabold" size={20}>
          New Paid Event
        </Txt>
        <Pressable testID="fee-close" onPress={() => router.back()} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSecondary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="close" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <KeyboardAwareScrollView bottomOffset={20} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.xl, paddingBottom: insets.bottom + 40, gap: 18 }}>
        <View>
          <Txt weight="medium" size={13} color={colors.onSurfaceSecondary} style={{ marginBottom: 6 }}>
            Event title
          </Txt>
          <TextInput
            testID="fee-title-input"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Saturday Skills Clinic"
            placeholderTextColor={colors.onSurfaceTertiary}
            style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 50, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
          />
        </View>

        <View>
          <Txt weight="medium" size={13} color={colors.onSurfaceSecondary} style={{ marginBottom: 6 }}>
            Price per person ($)
          </Txt>
          <TextInput
            testID="fee-price-input"
            value={price}
            onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ""))}
            placeholder="25"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.onSurfaceTertiary}
            style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 50, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
          />
        </View>

        {/* Payout method */}
        <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 16, gap: 10 }}>
          <Txt weight="bold" size={14}>
            Attendees pay you directly
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="logo-paypal" size={18} color={colors.brandPrimary} />
            <Txt weight="medium" size={13} color={colors.onSurfaceSecondary}>
              {currentUser.paymentLinks.paypal}
            </Txt>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="cash" size={18} color={colors.brandPrimary} />
            <Txt weight="medium" size={13} color={colors.onSurfaceSecondary}>
              Venmo {currentUser.paymentLinks.venmo}
            </Txt>
          </View>
        </View>

        {/* Fee explainer */}
        <View style={{ backgroundColor: colors.brandTertiary, borderRadius: radius.lg, padding: 16, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Txt weight="bold" size={15} color={colors.onBrandTertiary}>
              Paid-event fee
            </Txt>
            <Txt weight="extrabold" size={20} mono color={colors.onBrandTertiary}>
              ${PLATFORM_FEE.toFixed(2)}
            </Txt>
          </View>
          <Txt weight="medium" size={12} color={colors.onBrandTertiary} style={{ lineHeight: 18 }}>
            One-time fee to publish this paid event. Charged securely through the App Store / Google Play (in-app purchase). We never take a cut of your attendee payments.
          </Txt>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Ionicons name="information-circle" size={16} color={colors.onSurfaceTertiary} />
          <Txt weight="medium" size={11} color={colors.onSurfaceTertiary} style={{ flex: 1, lineHeight: 16 }}>
            In this preview the purchase is simulated. On a published iOS/Android build the fee is processed via in-app purchase.
          </Txt>
        </View>
      </KeyboardAwareScrollView>

      <View style={{ paddingHorizontal: spacing.xl, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.surface }}>
        <Pressable
          testID="pay-fee-btn"
          onPress={pay}
          disabled={!canPublish || status === "processing"}
          style={{ height: 54, borderRadius: radius.md, backgroundColor: canPublish ? colors.brandPrimary : colors.surfaceTertiary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {status === "processing" ? (
            <ActivityIndicator color={colors.onBrandPrimary} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color={canPublish ? colors.onBrandPrimary : colors.onSurfaceTertiary} />
              <Txt weight="bold" size={16} color={canPublish ? colors.onBrandPrimary : colors.onSurfaceTertiary}>
                Pay ${PLATFORM_FEE.toFixed(2)} & Publish
              </Txt>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
