import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, Tag, Ionicons } from "@/src/components/ui";
import { listings } from "@/src/data/mock";

export default function ListingDetailScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = listings.find((l) => l.id === id) ?? listings[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={{ width: "100%", aspectRatio: 1 }}>
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <Pressable testID="listing-back" onPress={() => router.back()} hitSlop={8} style={{ position: "absolute", top: insets.top + 8, left: spacing.xl, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <Pressable testID="listing-detail-like" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} hitSlop={8} style={{ position: "absolute", top: insets.top + 8, right: spacing.xl, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={{ padding: spacing.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Tag label={item.condition} tone="success" />
            <Tag label={item.sport} tone="neutral" />
          </View>
          <Txt weight="extrabold" size={32} mono color={colors.brandPrimary}>
            ${item.price}
          </Txt>
          <Txt weight="bold" size={20} style={{ marginTop: 6 }}>
            {item.title}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 }}>
            <Ionicons name="location-outline" size={15} color={colors.onSurfaceTertiary} />
            <Txt weight="medium" size={14} color={colors.onSurfaceTertiary}>
              {item.location}
            </Txt>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginVertical: 20 }} />

          {/* Seller */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar uri={`https://i.pravatar.cc/150?u=${item.seller}`} size={48} />
            <View style={{ flex: 1 }}>
              <Txt weight="bold" size={15}>
                {item.seller}
              </Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Ionicons name="star" size={13} color={colors.warning} />
                <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
                  4.9 · Trusted seller
                </Txt>
              </View>
            </View>
            <Ionicons name="shield-checkmark" size={22} color={colors.brandPrimary} />
          </View>

          {/* Description */}
          <Txt weight="extrabold" size={16} style={{ marginTop: 24, marginBottom: 8 }}>
            Details
          </Txt>
          <Txt weight="regular" size={14} color={colors.onSurfaceSecondary} style={{ lineHeight: 22 }}>
            {item.condition} {item.title.toLowerCase()} in great shape. Used for one season, no defects. Meet-up available around {item.location}. Payment and pickup arranged directly — no in-app payments.
          </Txt>

          {/* Affiliate nudge */}
          <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.brandTertiary, borderRadius: radius.md, padding: 14 }}>
            <Ionicons name="pricetag" size={18} color={colors.brandPrimary} />
            <Txt weight="semibold" size={13} color={colors.onBrandTertiary} style={{ flex: 1 }}>
              Prefer new? Get 20% off similar gear with your Wallet coupon.
            </Txt>
          </View>
        </View>
      </ScrollView>

      {/* Message seller bar */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", gap: 12, paddingHorizontal: spacing.xl, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
        <Pressable testID="make-offer-btn" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={{ flex: 1, height: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" }}>
          <Txt weight="bold" size={15} color={colors.brandPrimary}>
            Make Offer
          </Txt>
        </Pressable>
        <Pressable testID="message-seller-btn" onPress={() => router.push("/chat/g1")} style={{ flex: 1.4, height: 54, borderRadius: radius.md, backgroundColor: colors.brandPrimary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Ionicons name="chatbubble" size={18} color={colors.onBrandPrimary} />
          <Txt weight="bold" size={15} color={colors.onBrandPrimary}>
            Message Seller
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}
