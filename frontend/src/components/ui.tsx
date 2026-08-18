import React from "react";
import {
  Text,
  TextProps,
  View,
  ViewProps,
  Pressable,
  PressableProps,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { fonts } from "@/src/theme/tokens";

type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

interface TxtProps extends TextProps {
  weight?: Weight;
  size?: number;
  color?: string;
  mono?: boolean;
}

export function Txt({
  weight = "regular",
  size = 14,
  color,
  mono,
  style,
  ...rest
}: TxtProps) {
  const { colors } = useTheme();
  const family = mono
    ? weight === "bold" || weight === "extrabold" || weight === "semibold"
      ? fonts.monoBold
      : fonts.monoMedium
    : fonts[weight];
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: family, fontSize: size, color: color ?? colors.onSurface },
        style,
      ]}
    />
  );
}

export function Card({ style, ...rest }: ViewProps) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surfaceSecondary,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        style,
      ]}
    />
  );
}

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  testID?: string;
}

export function Chip({ label, active, onPress, icon, testID }: ChipProps) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={{
        height: 36,
        flexShrink: 0,
        paddingHorizontal: 16,
        borderRadius: radius.pill,
        backgroundColor: active ? colors.brandPrimary : colors.surfaceSecondary,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: active ? colors.brandPrimary : colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color={active ? colors.onBrandPrimary : colors.onSurfaceTertiary}
        />
      )}
      <Txt
        weight={active ? "semibold" : "medium"}
        size={13}
        color={active ? colors.onBrandPrimary : colors.onSurfaceSecondary}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

interface ChipRowProps {
  items: { key: string; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
  activeKey: string;
  onChange: (key: string) => void;
  testIDPrefix?: string;
}

export function ChipRow({ items, activeKey, onChange, testIDPrefix }: ChipRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      style={{ maxHeight: 56 }}
    >
      {items.map((it) => (
        <View key={it.key} style={{ justifyContent: "center" }}>
          <Chip
            testID={testIDPrefix ? `${testIDPrefix}-${it.key}` : undefined}
            label={it.label}
            icon={it.icon}
            active={activeKey === it.key}
            onPress={() => onChange(it.key)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "md" | "lg";
  full?: boolean;
}

export function Button({
  title,
  variant = "primary",
  icon,
  size = "md",
  full,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors, radius } = useTheme();
  const bg =
    variant === "primary"
      ? colors.brandPrimary
      : variant === "secondary"
        ? colors.surfaceTertiary
        : "transparent";
  const fg =
    variant === "primary"
      ? colors.onBrandPrimary
      : colors.onSurface;
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          height: size === "lg" ? 54 : 46,
          borderRadius: radius.md,
          backgroundColor: bg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingHorizontal: 20,
          opacity: pressed ? 0.85 : 1,
          alignSelf: full ? "stretch" : "flex-start",
        },
        style as any,
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={fg} />}
      <Txt weight="bold" size={15} color={fg}>
        {title}
      </Txt>
    </Pressable>
  );
}

export function Avatar({
  uri,
  size = 44,
  ring,
}: {
  uri: string;
  size?: number;
  ring?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring ? 2 : 0,
        borderColor: colors.brandPrimary,
        backgroundColor: colors.surfaceTertiary,
      }}
      contentFit="cover"
      transition={200}
    />
  );
}

export function Badge({ count }: { count: number }) {
  const { colors } = useTheme();
  if (!count) return null;
  return (
    <View
      style={{
        minWidth: 20,
        height: 20,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: colors.brandPrimary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Txt weight="bold" size={11} color={colors.onBrandPrimary}>
        {count}
      </Txt>
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
      }}
    >
      <Txt weight="extrabold" size={19}>
        {title}
      </Txt>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Txt weight="semibold" size={13} color={colors.brandPrimary}>
            {action}
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

export function Tag({
  label,
  tone = "brand",
}: {
  label: string;
  tone?: "brand" | "warning" | "neutral" | "success";
}) {
  const { colors, radius } = useTheme();
  const map = {
    brand: { bg: colors.brandSecondary, fg: colors.onBrandSecondary },
    warning: { bg: colors.warning, fg: colors.onWarning },
    neutral: { bg: colors.surfaceTertiary, fg: colors.onSurfaceTertiary },
    success: { bg: colors.success, fg: colors.onSuccess },
  }[tone];
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.sm,
        backgroundColor: map.bg,
      }}
    >
      <Txt weight="bold" size={10} color={map.fg} style={{ letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Txt>
    </View>
  );
}

export function RSVPControl({
  value,
  onChange,
  testID,
}: {
  value: "going" | "maybe" | "no" | null;
  onChange: (v: "going" | "maybe" | "no") => void;
  testID?: string;
}) {
  const { colors, radius } = useTheme();
  const opts: { key: "going" | "maybe" | "no"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "going", label: "Going", icon: "checkmark-circle" },
    { key: "maybe", label: "Maybe", icon: "help-circle" },
    { key: "no", label: "Can't", icon: "close-circle" },
  ];
  return (
    <View
      testID={testID}
      style={{
        flexDirection: "row",
        backgroundColor: colors.surfaceTertiary,
        borderRadius: radius.md,
        padding: 4,
        gap: 4,
      }}
    >
      {opts.map((o) => {
        const active = value === o.key;
        const activeColor =
          o.key === "going" ? colors.success : o.key === "maybe" ? colors.warning : colors.error;
        return (
          <Pressable
            key={o.key}
            testID={`rsvp-${o.key}`}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(o.key);
            }}
            style={{
              flex: 1,
              height: 40,
              borderRadius: radius.sm,
              backgroundColor: active ? activeColor : "transparent",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Ionicons
              name={o.icon}
              size={16}
              color={active ? "#fff" : colors.onSurfaceTertiary}
            />
            <Txt
              weight="bold"
              size={13}
              color={active ? "#fff" : colors.onSurfaceTertiary}
            >
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Loader() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={colors.brandPrimary} size="large" />
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  badge,
  testID,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  badge?: number;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.surfaceSecondary,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={name} size={20} color={colors.onSurface} />
      {!!badge && (
        <View style={{ position: "absolute", top: -3, right: -3 }}>
          <Badge count={badge} />
        </View>
      )}
    </Pressable>
  );
}

export { Ionicons };
