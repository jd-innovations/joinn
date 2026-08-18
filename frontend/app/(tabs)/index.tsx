import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, SectionHeader, IconButton, Ionicons } from "@/src/components/ui";
import {
  WeatherWidget,
  LiveActivityCard,
  NextUpCard,
  GroupCard,
} from "@/src/components/cards";
import {
  currentUser,
  liveActivities,
  events,
  groups,
} from "@/src/data/mock";

function ActionItem({
  icon,
  color,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceSecondary,
        borderRadius: radius.md,
        padding: 12,
        gap: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color + "22", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt weight="bold" size={14}>
          {title}
        </Txt>
        <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
          {subtitle}
        </Txt>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.xl, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
            Welcome back
          </Txt>
          <Txt weight="extrabold" size={24} numberOfLines={1}>
            {currentUser.first} 👋
          </Txt>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <IconButton testID="home-messages-btn" name="chatbubble-ellipses-outline" badge={4} onPress={() => router.push("/chat/g1")} />
          <IconButton testID="home-alerts-btn" name="notifications-outline" badge={2} />
          <Pressable testID="home-avatar-btn" onPress={() => router.push("/me")}>
            <Avatar uri={currentUser.avatar} size={42} ring />
          </Pressable>
        </View>
      </View>

      <ScrollView
        testID="home-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, gap: spacing.xl }}
      >
        <WeatherWidget onPress={() => router.push("/weather")} />

        {/* Live Activities */}
        <View>
          <SectionHeader title="Live Now" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
          >
            {liveActivities.map((l) => (
              <LiveActivityCard key={l.id} item={l} onPress={() => router.push(`/event/${l.eventId === "e1" ? "e1" : "e1"}`)} />
            ))}
          </ScrollView>
        </View>

        {/* Next up */}
        <View>
          <SectionHeader title="Next Up" action="Schedule" onAction={() => router.push("/schedule")} />
          <NextUpCard event={events[0]} onPress={() => router.push(`/event/${events[0].id}`)} />
        </View>

        {/* Needs attention */}
        <View style={{ gap: 10 }}>
          <SectionHeader title="Needs You" />
          <View style={{ paddingHorizontal: spacing.xl, gap: 10 }}>
            <ActionItem
              icon="hand-left"
              color={colors.warning}
              title="RSVP for Shootaround & Scrimmage"
              subtitle="Downtown Hoops · in 2 days"
              onPress={() => router.push(`/event/${events[2].id}`)}
            />
            <ActionItem
              icon="bar-chart"
              color={colors.brandPrimary}
              title="Vote: Best day for open play?"
              subtitle="SRQ Dink District · closes in 2 days"
              onPress={() => router.push(`/group/g3`)}
            />
            <ActionItem
              icon="people"
              color={colors.info}
              title="1 volunteer slot open — Scorekeeper"
              subtitle="Riverside FC · League Match"
              onPress={() => router.push(`/event/${events[0].id}`)}
            />
          </View>
        </View>

        {/* Your groups */}
        <View style={{ gap: 10 }}>
          <SectionHeader title="Your Teams" action="See all" onAction={() => router.push("/groups")} />
          <View style={{ paddingHorizontal: spacing.xl, gap: 10 }}>
            {groups.slice(0, 4).map((g) => (
              <GroupCard key={g.id} group={g} onPress={() => router.push(`/group/${g.id}`)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
