import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, Tag, Ionicons } from "@/src/components/ui";
import { groups, members, events, polls, messagesByGroup } from "@/src/data/mock";

const TILES: {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { key: "chat", label: "Chat", icon: "chatbubbles", color: "#059669" },
  { key: "schedule", label: "Schedule", icon: "calendar", color: "#D97706" },
  { key: "polls", label: "Polls", icon: "bar-chart", color: "#0EA5A0" },
  { key: "members", label: "Members", icon: "people", color: "#16A34A" },
  { key: "media", label: "Media", icon: "images", color: "#EA580C" },
  { key: "volunteers", label: "Volunteers", icon: "hand-left", color: "#0F766E" },
];

export default function GroupHubScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = groups.find((g) => g.id === id) ?? groups[0];
  const groupEvents = events.filter((e) => e.groupId === group.id);
  const recent = messagesByGroup[group.id] ?? messagesByGroup.g1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Header */}
        <View style={{ height: 200 }}>
          <Image source={{ uri: group.logo }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.75)"]} style={StyleSheet.absoluteFill} />
          <View style={{ flex: 1, padding: spacing.xl, paddingTop: insets.top + 8, justifyContent: "space-between" }}>
            <Pressable testID="group-back" onPress={() => router.back()} hitSlop={8} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Tag label={group.sport} tone="brand" />
                {group.premium && <Tag label="Premium" tone="warning" />}
              </View>
              <Txt weight="extrabold" size={26} color="#fff" style={{ marginTop: 6 }}>
                {group.name}
              </Txt>
              <Txt weight="medium" size={13} color="rgba(255,255,255,0.9)">
                {`${group.memberCount} members · You're ${group.role}`}
              </Txt>
            </View>
          </View>
        </View>

        {/* Feature tiles */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: spacing.xl, gap: 12 }}>
          {TILES.map((t) => (
            <Pressable
              key={t.key}
              testID={`group-tile-${t.key}`}
              onPress={() => {
                if (t.key === "chat") router.push(`/chat/${group.id}`);
                else if (t.key === "schedule") router.push("/schedule");
              }}
              style={{ width: "31%", aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.color + "22", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={t.icon} size={22} color={t.color} />
              </View>
              <Txt weight="semibold" size={13}>
                {t.label}
              </Txt>
            </Pressable>
          ))}
        </View>

        {/* Poll */}
        {polls.map((p) => {
          const max = Math.max(...p.options.map((o) => o.votes));
          return (
            <View key={p.id} style={{ marginHorizontal: spacing.xl, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 16, marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Ionicons name="bar-chart" size={16} color={colors.brandPrimary} />
                <Txt weight="bold" size={15} style={{ flex: 1 }}>
                  {p.question}
                </Txt>
              </View>
              {p.options.map((o, i) => {
                const pct = Math.round((o.votes / p.total) * 100);
                return (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <View style={{ height: 38, borderRadius: radius.sm, backgroundColor: colors.surfaceTertiary, overflow: "hidden", justifyContent: "center" }}>
                      <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: o.votes === max ? colors.brandSecondary : colors.surfaceTertiary }} />
                      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
                        <Txt weight="semibold" size={13}>
                          {o.label}
                        </Txt>
                        <Txt weight="bold" size={13} mono color={colors.onSurfaceSecondary}>
                          {pct}%
                        </Txt>
                      </View>
                    </View>
                  </View>
                );
              })}
              <Txt weight="medium" size={12} color={colors.onSurfaceTertiary} style={{ marginTop: 4 }}>
                {p.total} votes · {p.deadline}
              </Txt>
            </View>
          );
        })}

        {/* Upcoming */}
        {groupEvents.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Txt weight="extrabold" size={17} style={{ marginHorizontal: spacing.xl, marginBottom: 12 }}>
              Upcoming
            </Txt>
            {groupEvents.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => router.push(`/event/${e.id}`)}
                style={{ marginHorizontal: spacing.xl, flexDirection: "row", alignItems: "center", gap: 12, padding: 14, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, marginBottom: 8 }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="calendar" size={20} color={colors.brandPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt weight="bold" size={14} numberOfLines={1}>
                    {e.title}
                  </Txt>
                  <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                    {e.venue}
                  </Txt>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Members */}
        <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.xl, gap: -8 }}>
          <Txt weight="extrabold" size={17} style={{ flex: 1 }}>
            Members
          </Txt>
          <View style={{ flexDirection: "row" }}>
            {members.slice(0, 5).map((m, i) => (
              <View key={m.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                <Avatar uri={m.avatar} size={34} />
              </View>
            ))}
            <View style={{ marginLeft: -10, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}>
              <Txt weight="bold" size={11} color={colors.onSurfaceTertiary}>
                +{group.memberCount - 5}
              </Txt>
            </View>
          </View>
        </View>

        {/* Recent chat preview */}
        <Pressable onPress={() => router.push(`/chat/${group.id}`)} style={{ marginTop: 16, marginHorizontal: spacing.xl, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 16, gap: 12 }}>
          {recent.slice(-2).map((m) => (
            <View key={m.id} style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              {!m.system && <Avatar uri={m.avatar} size={30} />}
              <View style={{ flex: 1 }}>
                {!m.system && (
                  <Txt weight="semibold" size={12} color={colors.onSurfaceSecondary}>
                    {m.author}
                  </Txt>
                )}
                <Txt weight="medium" size={13} color={colors.onSurfaceTertiary} numberOfLines={1}>
                  {m.text}
                </Txt>
              </View>
            </View>
          ))}
        </Pressable>
      </ScrollView>
    </View>
  );
}
