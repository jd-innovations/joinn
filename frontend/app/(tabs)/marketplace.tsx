import React, { useState } from "react";
import { View, ScrollView, TextInput, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, ChipRow, Ionicons } from "@/src/components/ui";
import { ListingCard } from "@/src/components/cards";
import { listings as seed, Listing } from "@/src/data/mock";

const FILTERS = [
  { key: "all", label: "All Gear" },
  { key: "Soccer", label: "Soccer" },
  { key: "Basketball", label: "Basketball" },
  { key: "Pickleball", label: "Pickleball" },
  { key: "Tennis", label: "Tennis" },
  { key: "Volleyball", label: "Volleyball" },
  { key: "Running", label: "Running" },
];

export default function MarketplaceScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Listing[]>(seed);

  const GAP = 12;
  const cardW = (width - spacing.xl * 2 - GAP) / 2;

  const filtered = items.filter(
    (l) =>
      (filter === "all" || l.sport === filter) &&
      (q.trim() === "" || l.title.toLowerCase().includes(q.toLowerCase())),
  );

  const toggleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, liked: !l.liked } : l)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ paddingTop: insets.top + 8, backgroundColor: colors.surface, gap: 14 }}>
        <View style={{ paddingHorizontal: spacing.xl }}>
          <Txt weight="extrabold" size={28}>
            Marketplace
          </Txt>
          <Txt weight="medium" size={13} color={colors.onSurfaceTertiary} style={{ marginTop: 2 }}>
            Buy & sell gear with your community
          </Txt>
        </View>
        <View style={{ paddingHorizontal: spacing.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 14, height: 48, gap: 10 }}>
            <Ionicons name="search" size={18} color={colors.onSurfaceTertiary} />
            <TextInput
              testID="market-search-input"
              value={q}
              onChangeText={setQ}
              placeholder="Search gear, brands, sports"
              placeholderTextColor={colors.onSurfaceTertiary}
              style={{ flex: 1, fontFamily: "Jakarta-Medium", fontSize: 15, color: colors.onSurface }}
            />
          </View>
        </View>
        <ChipRow items={FILTERS} activeKey={filter} onChange={setFilter} testIDPrefix="market-filter" />
      </View>

      <ScrollView
        testID="market-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: 14, paddingBottom: insets.bottom + 110 }}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: GAP }}>
          {filtered.map((l) => (
            <ListingCard
              key={l.id}
              item={l}
              width={cardW}
              onPress={() => router.push(`/listing/${l.id}`)}
              onLike={() => toggleLike(l.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        testID="create-listing-fab"
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        style={{
          position: "absolute",
          right: spacing.xl,
          bottom: insets.bottom + 90,
          height: 54,
          paddingHorizontal: 20,
          borderRadius: radius.pill,
          backgroundColor: colors.brandPrimary,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 14,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={22} color={colors.onBrandPrimary} />
        <Txt weight="bold" size={15} color={colors.onBrandPrimary}>
          Sell
        </Txt>
      </Pressable>
    </View>
  );
}
