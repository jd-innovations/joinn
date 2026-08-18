import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Tag, RSVPControl, Ionicons } from "./ui";
import {
  EventItem,
  Group,
  LiveActivity,
  Listing,
  WalletItem,
  formatEventTime,
  countdown,
  weatherNow,
} from "@/src/data/mock";

const wxIcon = (name: string): keyof typeof Ionicons.glyphMap => {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    sunny: "sunny",
    "partly-sunny": "partly-sunny",
    cloudy: "cloud",
    rainy: "rainy",
  };
  return map[name] ?? "partly-sunny";
};

/* ---------- Weather widget (glass) ---------- */
export function WeatherWidget({ onPress }: { onPress?: () => void }) {
  const { colors, radius, scheme } = useTheme();
  return (
    <Pressable testID="weather-widget" onPress={onPress} style={{ marginHorizontal: 20 }}>
      <BlurView
        intensity={scheme === "dark" ? 40 : 60}
        tint={scheme === "dark" ? "dark" : "light"}
        style={{
          borderRadius: radius.lg,
          overflow: "hidden",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            backgroundColor:
              scheme === "dark" ? "rgba(30,41,59,0.75)" : "rgba(255,255,255,0.7)",
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name={wxIcon("partly-sunny")} size={44} color={colors.warning} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Txt weight="extrabold" size={40}>
                {weatherNow.tempF}
              </Txt>
              <Txt weight="bold" size={20} style={{ marginTop: 4 }}>
                °
              </Txt>
            </View>
            <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>
              {weatherNow.condition} · Feels {weatherNow.feelsF}°
            </Txt>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location" size={12} color={colors.brandPrimary} />
              <Txt weight="semibold" size={11} color={colors.onSurfaceSecondary}>
                {weatherNow.location}
              </Txt>
            </View>
            <Txt weight="medium" size={12} color={colors.onSurfaceTertiary} style={{ marginTop: 4 }}>
              H:{weatherNow.hi}° L:{weatherNow.lo}°
            </Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 }}>
              <Ionicons name="water" size={11} color={colors.info} />
              <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
                {weatherNow.precip}%
              </Txt>
            </View>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

/* ---------- Live Activity card ---------- */
export function LiveActivityCard({
  item,
  onPress,
}: {
  item: LiveActivity;
  onPress?: () => void;
}) {
  const { colors, radius } = useTheme();
  const isLive = item.status === "live";
  const statusColor = isLive ? colors.error : item.status === "final" ? colors.info : colors.brandPrimary;
  return (
    <Pressable
      testID={`live-card-${item.id}`}
      onPress={onPress}
      style={{
        width: 220,
        borderRadius: radius.lg,
        overflow: "hidden",
        backgroundColor: colors.surfaceInverse,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {isLive && (
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor }} />
          )}
          <Txt weight="bold" size={11} color={statusColor} style={{ letterSpacing: 0.6 }}>
            {isLive ? "LIVE" : item.status === "final" ? "FINAL" : "UPCOMING"}
          </Txt>
        </View>
        <Txt weight="medium" size={11} color={colors.onSurfaceInverse} mono style={{ opacity: 0.7 }}>
          {item.clock}
        </Txt>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <Txt weight="bold" size={16} color={colors.onSurfaceInverse}>
          {item.homeName}
        </Txt>
        <Txt weight="extrabold" size={22} color={colors.onSurfaceInverse} mono>
          {item.homeScore}
        </Txt>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <Txt weight="bold" size={16} color={colors.onSurfaceInverse} style={{ opacity: 0.85 }}>
          {item.awayName}
        </Txt>
        <Txt weight="extrabold" size={22} color={colors.onSurfaceInverse} mono style={{ opacity: 0.85 }}>
          {item.awayScore}
        </Txt>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.onSurfaceInverse, opacity: 0.15, marginVertical: 10 }} />
      <Txt weight="medium" size={11} color={colors.onSurfaceInverse} style={{ opacity: 0.7 }} numberOfLines={1}>
        {item.detail}
      </Txt>
    </Pressable>
  );
}

/* ---------- Featured Next-Up event card ---------- */
export function NextUpCard({ event, onPress }: { event: EventItem; onPress?: () => void }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      testID="next-up-card"
      onPress={onPress}
      style={{ marginHorizontal: 20, borderRadius: radius.lg, overflow: "hidden", height: 200 }}
    >
      <Image source={{ uri: event.cover }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.85)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1, justifyContent: "space-between", padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Tag label={event.type} tone="brand" />
            <View style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="time" size={11} color="#fff" />
              <Txt weight="bold" size={10} color="#fff" mono>
                {countdown(event.start)}
              </Txt>
            </View>
          </View>
          <View style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name={wxIcon(event.weather.icon)} size={13} color="#fff" />
            <Txt weight="bold" size={11} color="#fff">
              {event.weather.tempF}°
            </Txt>
          </View>
        </View>
        <View>
          <Txt weight="semibold" size={12} color="rgba(255,255,255,0.8)">
            {event.groupName}
          </Txt>
          <Txt weight="extrabold" size={20} color="#fff" numberOfLines={2} style={{ marginTop: 2 }}>
            {event.title}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Ionicons name="location" size={13} color={colors.brand} />
            <Txt weight="medium" size={12} color="rgba(255,255,255,0.9)" numberOfLines={1} style={{ flex: 1 }}>
              {event.venue}
            </Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="people" size={13} color="#fff" />
              <Txt weight="bold" size={12} color="#fff">
                {event.goingCount}
              </Txt>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* ---------- Group card ---------- */
export function GroupCard({ group, onPress }: { group: Group; onPress?: () => void }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      testID={`group-card-${group.id}`}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceSecondary,
        borderRadius: radius.lg,
        padding: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        gap: 12,
      }}
    >
      <Image
        source={{ uri: group.logo }}
        style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceTertiary }}
        contentFit="cover"
        transition={200}
      />
      <View style={{ flex: 1 }}>
        <Txt weight="bold" size={16} numberOfLines={1}>
          {group.name}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: group.color }} />
          <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
            {group.sport} · {group.memberCount} members
          </Txt>
        </View>
      </View>
      {group.unread > 0 ? (
        <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 }}>
          <Txt weight="bold" size={11} color={colors.onBrandPrimary}>
            {group.unread}
          </Txt>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />
      )}
    </Pressable>
  );
}

/* ---------- Marketplace listing card (grid) ---------- */
export function ListingCard({
  item,
  width,
  onPress,
  onLike,
}: {
  item: Listing;
  width: number;
  onPress?: () => void;
  onLike?: () => void;
}) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      testID={`listing-card-${item.id}`}
      onPress={onPress}
      style={{ width, borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surfaceSecondary, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}
    >
      <View style={{ width: "100%", aspectRatio: 1 }}>
        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        <Pressable
          testID={`listing-like-${item.id}`}
          onPress={onLike}
          hitSlop={8}
          style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name={item.liked ? "heart" : "heart-outline"} size={17} color={item.liked ? colors.error : "#fff"} />
        </Pressable>
        <View style={{ position: "absolute", bottom: 8, left: 8 }}>
          <Tag label={item.condition} tone="neutral" />
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Txt weight="extrabold" size={16} color={colors.brandPrimary} mono>
          ${item.price}
        </Txt>
        <Txt weight="medium" size={13} numberOfLines={2} style={{ marginTop: 2, minHeight: 34 }}>
          {item.title}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Ionicons name="location-outline" size={11} color={colors.onSurfaceTertiary} />
          <Txt weight="medium" size={11} color={colors.onSurfaceTertiary} numberOfLines={1}>
            {item.location}
          </Txt>
        </View>
      </View>
    </Pressable>
  );
}

/* ---------- Wallet card ---------- */
export function WalletCard({ item, onPress }: { item: WalletItem; onPress?: () => void }) {
  const { radius } = useTheme();
  const icon: keyof typeof Ionicons.glyphMap =
    item.type === "referral" ? "gift" : item.type === "reward" ? "trophy" : "pricetag";
  return (
    <Pressable testID={`wallet-card-${item.id}`} onPress={onPress} style={{ borderRadius: radius.lg, overflow: "hidden" }}>
      <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, minHeight: 130, justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name={icon} size={18} color="rgba(255,255,255,0.9)" />
            <Txt weight="bold" size={13} color="rgba(255,255,255,0.95)">
              {item.brand}
            </Txt>
          </View>
          <Txt weight="extrabold" size={16} color="#fff" mono>
            {item.value}
          </Txt>
        </View>
        <View>
          <Txt weight="bold" size={17} color="#fff">
            {item.title}
          </Txt>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
              <Txt weight="bold" size={12} color="#fff" mono>
                {item.code}
              </Txt>
            </View>
            {item.expires && (
              <Txt weight="medium" size={11} color="rgba(255,255,255,0.85)">
                Exp {item.expires}
              </Txt>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/* ---------- Schedule event row ---------- */
export function ScheduleCard({
  event,
  onPress,
  onRSVP,
}: {
  event: EventItem;
  onPress?: () => void;
  onRSVP?: (v: "going" | "maybe" | "no") => void;
}) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      testID={`schedule-card-${event.id}`}
      onPress={onPress}
      style={{ backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 14 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Tag label={event.type} tone="brand" />
          <Txt weight="semibold" size={12} color={colors.onSurfaceTertiary}>
            {event.groupName}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name={wxIcon(event.weather.icon)} size={14} color={colors.warning} />
          <Txt weight="semibold" size={12} color={colors.onSurfaceTertiary}>
            {event.weather.tempF}°
          </Txt>
        </View>
      </View>
      <Txt weight="bold" size={16} numberOfLines={1}>
        {event.title}
      </Txt>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 }}>
        <Ionicons name="calendar-outline" size={13} color={colors.brandPrimary} />
        <Txt weight="semibold" size={12} color={colors.onSurfaceSecondary}>
          {formatEventTime(event.start)}
        </Txt>
        <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
          · {event.venue}
        </Txt>
      </View>
      <View style={{ marginTop: 12 }}>
        <RSVPControl value={event.rsvp} onChange={(v) => onRSVP?.(v)} />
      </View>
    </Pressable>
  );
}
