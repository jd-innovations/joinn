import React, { useState, useRef } from "react";
import { View, ScrollView, Pressable, TextInput, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, Ionicons } from "@/src/components/ui";
import { messagesByGroup, groups, Message } from "@/src/data/mock";

function Bubble({ m }: { m: Message }) {
  const { colors, radius } = useTheme();
  if (m.system) {
    return (
      <View style={{ alignItems: "center", marginVertical: 8 }}>
        <View style={{ backgroundColor: colors.surfaceTertiary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill }}>
          <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
            {m.text}
          </Txt>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 14, justifyContent: m.mine ? "flex-end" : "flex-start" }}>
      {!m.mine && <Avatar uri={m.avatar} size={32} />}
      <View style={{ maxWidth: "74%" }}>
        {!m.mine && (
          <Txt weight="semibold" size={12} color={colors.onSurfaceTertiary} style={{ marginBottom: 3, marginLeft: 4 }}>
            {m.author}
          </Txt>
        )}
        <View
          style={{
            backgroundColor: m.mine ? colors.brandPrimary : colors.surfaceSecondary,
            borderWidth: m.mine ? 0 : StyleSheet.hairlineWidth,
            borderColor: colors.border,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: radius.lg,
            borderBottomRightRadius: m.mine ? 4 : radius.lg,
            borderBottomLeftRadius: m.mine ? radius.lg : 4,
          }}
        >
          <Txt weight="regular" size={14} color={m.mine ? colors.onBrandPrimary : colors.onSurface} style={{ lineHeight: 20 }}>
            {m.text}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 4, marginHorizontal: 4, justifyContent: m.mine ? "flex-end" : "flex-start" }}>
          {m.reactions?.map((r, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.surfaceTertiary, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 }}>
              <Txt size={11}>{r.emoji}</Txt>
              <Txt weight="semibold" size={11} color={colors.onSurfaceTertiary}>
                {r.count}
              </Txt>
            </View>
          ))}
          <Txt weight="medium" size={10} color={colors.onSurfaceTertiary}>
            {m.time}
          </Txt>
        </View>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = groups.find((g) => g.id === id) ?? groups[0];
  const [messages, setMessages] = useState<Message[]>(messagesByGroup[group.id] ?? messagesByGroup.g1);
  const [text, setText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: `n${Date.now()}`,
      author: "Jordan Dixon",
      avatar: "https://i.pravatar.cc/150?img=12",
      text: text.trim(),
      time: "now",
      mine: true,
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <Pressable testID="chat-back" onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.onSurface} />
        </Pressable>
        <Avatar uri={group.logo} size={38} />
        <View style={{ flex: 1 }}>
          <Txt weight="bold" size={16} numberOfLines={1}>
            {group.name}
          </Txt>
          <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
            {group.memberCount} members
          </Txt>
        </View>
        <Ionicons name="information-circle-outline" size={24} color={colors.onSurfaceTertiary} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "translate-with-padding"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          testID="chat-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.lg }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
        </ScrollView>

        {/* Input */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: spacing.lg, paddingTop: 8, paddingBottom: insets.bottom > 0 ? insets.bottom : 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.surface }}>
          <Pressable testID="chat-attach" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceSecondary, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="add" size={24} color={colors.brandPrimary} />
          </Pressable>
          <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 16, minHeight: 44, justifyContent: "center", maxHeight: 120 }}>
            <TextInput
              testID="chat-input"
              value={text}
              onChangeText={setText}
              placeholder="Message"
              placeholderTextColor={colors.onSurfaceTertiary}
              multiline
              style={{ fontFamily: "Jakarta-Regular", fontSize: 15, color: colors.onSurface, paddingVertical: Platform.OS === "ios" ? 12 : 8 }}
            />
          </View>
          <Pressable
            testID="chat-send"
            onPress={send}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: text.trim() ? colors.brandPrimary : colors.surfaceTertiary, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="arrow-up" size={22} color={text.trim() ? colors.onBrandPrimary : colors.onSurfaceTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
