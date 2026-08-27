import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, ChipRow, Ionicons } from "@/src/components/ui";
import { GroupCard } from "@/src/components/cards";
import { groups } from "@/src/data/mock";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "Soccer", label: "Soccer" },
  { key: "Basketball", label: "Basketball" },
  { key: "Pickleball", label: "Pickleball" },
  { key: "Tennis", label: "Tennis" },
  { key: "Volleyball", label: "Volleyball" },
  { key: "Running", label: "Running" },
];

export default function GroupsScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [code, setCode] = useState("");

  const filtered = groups.filter((g) => filter === "all" || g.sport === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Sticky header */}
      <View style={{ paddingTop: insets.top + 8, backgroundColor: colors.surface }}>
        <View style={{ paddingHorizontal: spacing.xl, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Txt weight="extrabold" size={28}>
            Teams
          </Txt>
          <Pressable
            testID="create-group-btn"
            onPress={() => router.push("/create-event")}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.brandPrimary, paddingHorizontal: 14, height: 40, borderRadius: radius.pill }}
          >
            <Ionicons name="add" size={18} color={colors.onBrandPrimary} />
            <Txt weight="bold" size={13} color={colors.onBrandPrimary}>
              Create
            </Txt>
          </Pressable>
        </View>

        {/* Enter group code */}
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 50, gap: 10 }}>
            <Ionicons name="search" size={18} color={colors.onSurfaceTertiary} />
            <TextInput
              testID="group-code-input"
              value={code}
              onChangeText={setCode}
              placeholder="Enter group code to join"
              placeholderTextColor={colors.onSurfaceTertiary}
              autoCapitalize="characters"
              style={{ flex: 1, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
            />
            <Pressable testID="join-code-btn" style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.brandSecondary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="arrow-forward" size={18} color={colors.onBrandSecondary} />
            </Pressable>
          </View>
        </View>

        <ChipRow items={FILTERS} activeKey={filter} onChange={setFilter} testIDPrefix="groups-filter" />
      </View>

      <ScrollView
        testID="groups-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 14, paddingBottom: insets.bottom + 100, gap: 10 }}
      >
        {filtered.map((g) => (
          <GroupCard key={g.id} group={g} onPress={() => router.push(`/group/${g.id}`)} />
        ))}
      </ScrollView>
    </View>
  );
}
