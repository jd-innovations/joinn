import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme, ThemeMode } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, SectionHeader, Ionicons } from "@/src/components/ui";
import { WalletCard } from "@/src/components/cards";
import { currentUser, walletItems } from "@/src/data/mock";

function Stat({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Txt weight="extrabold" size={22} mono color={colors.brandPrimary}>
        {value}
      </Txt>
      <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
        {label}
      </Txt>
    </View>
  );
}

function Row({
  icon,
  title,
  value,
  onPress,
  right,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 14 }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={19} color={colors.brandPrimary} />
      </View>
      <Txt weight="semibold" size={15} style={{ flex: 1 }}>
        {title}
      </Txt>
      {value && (
        <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
          {value}
        </Txt>
      )}
      {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />)}
    </Pressable>
  );
}

export default function MeScreen() {
  const { colors, spacing, radius, mode, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pushOn, setPushOn] = useState(true);

  const modeLabel: Record<ThemeMode, string> = { system: "System", light: "Light", dark: "Dark" };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        testID="me-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }}
      >
        {/* Profile header */}
        <View style={{ alignItems: "center", paddingHorizontal: spacing.xl }}>
          <Avatar uri={currentUser.avatar} size={88} ring />
          <Txt weight="extrabold" size={22} style={{ marginTop: 12 }}>
            {currentUser.name}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Ionicons name="location" size={13} color={colors.brandPrimary} />
            <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
              {currentUser.location}
            </Txt>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginHorizontal: spacing.xl, marginTop: 20, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingVertical: 16 }}>
          <Stat value="6" label="Teams" />
          <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          <Stat value={`$${currentUser.savings}`} label="Saved" />
          <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          <Stat value={currentUser.points.toLocaleString()} label="Points" />
        </View>

        {/* Wallet */}
        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Wallet" action="View all" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
            {walletItems.map((w) => (
              <View key={w.id} style={{ width: 280 }}>
                <WalletCard item={w} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Settings */}
        <View style={{ marginTop: 28, paddingHorizontal: spacing.xl }}>
          <Txt weight="extrabold" size={19} style={{ marginBottom: 4 }}>
            Settings
          </Txt>
          <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14 }}>
            <Row
              testID="appearance-row"
              icon="contrast"
              title="Appearance"
              value={modeLabel[mode]}
              onPress={() => router.push("/appearance")}
            />
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.divider }} />
            <Row
              testID="notifications-row"
              icon="notifications"
              title="Push Notifications"
              right={
                <Switch
                  testID="push-switch"
                  value={pushOn}
                  onValueChange={setPushOn}
                  trackColor={{ true: colors.brandPrimary, false: colors.surfaceTertiary }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.divider }} />
            <Row icon="shield-checkmark" title="Privacy & Safety" onPress={() => {}} />
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.divider }} />
            <Row icon="help-circle" title="Help & Support" onPress={() => {}} />
          </View>

          <Pressable testID="signout-btn" style={{ marginTop: 16, height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
            <Txt weight="bold" size={15} color={colors.error}>
              Sign Out
            </Txt>
          </Pressable>
          <Txt weight="medium" size={12} color={colors.onSurfaceTertiary} style={{ textAlign: "center", marginTop: 14 }}>
            Sideline · v1.0.0 · {scheme} mode
          </Txt>
        </View>
      </ScrollView>
    </View>
  );
}
