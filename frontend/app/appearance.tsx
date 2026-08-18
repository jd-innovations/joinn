import React from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme, ThemeMode } from "@/src/theme/ThemeProvider";
import { Txt, Ionicons } from "@/src/components/ui";

const OPTIONS: {
  key: ThemeMode;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "system", label: "System", desc: "Match your device settings", icon: "phone-portrait" },
  { key: "light", label: "Light", desc: "Bright and clean", icon: "sunny" },
  { key: "dark", label: "Dark", desc: "Easy on the eyes", icon: "moon" },
];

export default function AppearanceScreen() {
  const { colors, spacing, radius, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: insets.top + 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingBottom: 8 }}>
        <Txt weight="extrabold" size={22}>
          Appearance
        </Txt>
        <Pressable testID="appearance-close" onPress={() => router.back()} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSecondary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="close" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <View style={{ padding: spacing.xl, gap: 12 }}>
        {OPTIONS.map((o) => {
          const active = mode === o.key;
          return (
            <Pressable
              key={o.key}
              testID={`theme-option-${o.key}`}
              onPress={() => setMode(o.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 16,
                borderRadius: radius.lg,
                backgroundColor: active ? colors.brandTertiary : colors.surfaceSecondary,
                borderWidth: 1.5,
                borderColor: active ? colors.brandPrimary : colors.border,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: active ? colors.brandPrimary : colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={o.icon} size={22} color={active ? colors.onBrandPrimary : colors.onSurfaceTertiary} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt weight="bold" size={16}>
                  {o.label}
                </Txt>
                <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
                  {o.desc}
                </Txt>
              </View>
              {active && <Ionicons name="checkmark-circle" size={24} color={colors.brandPrimary} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
