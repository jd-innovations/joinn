import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Ionicons } from "@/src/components/ui";
import { weatherNow } from "@/src/data/mock";

const wxIcon = (name: string): keyof typeof Ionicons.glyphMap => {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    sunny: "sunny",
    "partly-sunny": "partly-sunny",
    cloudy: "cloud",
    rainy: "rainy",
  };
  return map[name] ?? "partly-sunny";
};

export default function WeatherScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const playColor =
    weatherNow.playability === "good"
      ? colors.success
      : weatherNow.playability === "caution"
        ? colors.warning
        : colors.error;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Hero */}
        <LinearGradient
          colors={[colors.brandPrimary, colors.brand + "AA", colors.surface]}
          style={{ paddingTop: insets.top + 8, paddingBottom: 30, paddingHorizontal: spacing.xl }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable testID="weather-close" onPress={() => router.back()} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={{ alignItems: "center", marginTop: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="location" size={14} color="#fff" />
              <Txt weight="semibold" size={14} color="#fff">
                {weatherNow.location}
              </Txt>
            </View>
            <Ionicons name={wxIcon("partly-sunny")} size={72} color="#fff" style={{ marginTop: 12 }} />
            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 6 }}>
              <Txt weight="extrabold" size={72} color="#fff">
                {weatherNow.tempF}
              </Txt>
              <Txt weight="bold" size={32} color="#fff" style={{ marginTop: 8 }}>
                °
              </Txt>
            </View>
            <Txt weight="semibold" size={16} color="#fff">
              {weatherNow.condition}
            </Txt>
            <Txt weight="medium" size={14} color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>
              Feels like {weatherNow.feelsF}° · H:{weatherNow.hi}° L:{weatherNow.lo}°
            </Txt>
          </View>
        </LinearGradient>

        {/* Playability */}
        <View style={{ marginHorizontal: spacing.xl, marginTop: -14, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: playColor + "22", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="tennisball" size={22} color={playColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt weight="bold" size={15}>
              Playability: Good
            </Txt>
            <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
              Great conditions for outdoor play through 4 PM
            </Txt>
          </View>
        </View>

        {/* Hourly */}
        <Txt weight="extrabold" size={17} style={{ marginHorizontal: spacing.xl, marginTop: 24, marginBottom: 12 }}>
          Hourly
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: spacing.xl }}>
          {weatherNow.hourly.map((h, i) => (
            <View key={i} style={{ width: 62, alignItems: "center", gap: 8, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingVertical: 12 }}>
              <Txt weight="semibold" size={12} color={colors.onSurfaceTertiary}>
                {h.t}
              </Txt>
              <Ionicons name={wxIcon(h.icon)} size={22} color={colors.warning} />
              <Txt weight="bold" size={14} mono>
                {h.temp}°
              </Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Ionicons name="water" size={9} color={colors.info} />
                <Txt weight="medium" size={10} color={colors.onSurfaceTertiary}>
                  {h.precip}%
                </Txt>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Daily */}
        <Txt weight="extrabold" size={17} style={{ marginHorizontal: spacing.xl, marginTop: 24, marginBottom: 12 }}>
          5-Day Forecast
        </Txt>
        <View style={{ marginHorizontal: spacing.xl, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 16 }}>
          {weatherNow.daily.map((d, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: i < weatherNow.daily.length - 1 ? StyleSheet.hairlineWidth : 0, borderBottomColor: colors.divider }}>
              <Txt weight="semibold" size={14} style={{ width: 48 }}>
                {d.d}
              </Txt>
              <Ionicons name={wxIcon(d.icon)} size={22} color={colors.warning} style={{ flex: 1 }} />
              <Txt weight="medium" size={14} color={colors.onSurfaceTertiary} mono>
                {d.lo}°
              </Txt>
              <View style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: colors.surfaceTertiary, marginHorizontal: 10, overflow: "hidden" }}>
                <View style={{ position: "absolute", left: 8, right: 8, top: 0, bottom: 0, borderRadius: 2, backgroundColor: colors.warning }} />
              </View>
              <Txt weight="bold" size={14} mono>
                {d.hi}°
              </Txt>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
