import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Ionicons } from "@/src/components/ui";

const TABS: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "index", label: "Home", icon: "home-outline", iconActive: "home" },
  { name: "groups", label: "Groups", icon: "people-outline", iconActive: "people" },
  { name: "schedule", label: "Schedule", icon: "calendar-outline", iconActive: "calendar" },
  { name: "marketplace", label: "Market", icon: "storefront-outline", iconActive: "storefront" },
  { name: "me", label: "Me", icon: "person-outline", iconActive: "person" },
];

function CustomTabBar({ state, navigation }: any) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      intensity={scheme === "dark" ? 40 : 70}
      tint={scheme === "dark" ? "dark" : "light"}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          backgroundColor:
            scheme === "dark" ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.7)",
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              testID={`tab-${tab.name}`}
              onPress={() => {
                Haptics.selectionAsync();
                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={{ flex: 1, alignItems: "center", gap: 3 }}
            >
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={24}
                color={focused ? colors.brandPrimary : colors.onSurfaceTertiary}
              />
              <Txt
                weight={focused ? "bold" : "medium"}
                size={10}
                color={focused ? colors.brandPrimary : colors.onSurfaceTertiary}
              >
                {tab.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}
