import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Linking } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/theme/ThemeProvider";
import { Txt, Avatar, Tag, RSVPControl, Ionicons } from "@/src/components/ui";
import { events, members, liveActivities, formatEventTime, countdown } from "@/src/data/mock";
import { useStore, getMyRegistration, getCounts } from "@/src/data/store";

export default function EventDetailScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events.find((e) => e.id === id) ?? events[0];
  const live = liveActivities.find((l) => l.eventId === event.id);
  const [rsvp, setRsvp] = useState(event.rsvp);
  const [checkedIn, setCheckedIn] = useState(false);

  useStore();
  const isReg = event.mode === "reg_free" || event.mode === "reg_paid";
  const isPaid = event.mode === "reg_paid";
  const price = event.paid?.price ?? 0;
  const cap = event.registration?.capacity ?? 0;
  const myReg = getMyRegistration(event.id);
  const counts = getCounts(event.id);

  const openMaps = () => {
    const q = encodeURIComponent(event.address);
    Linking.openURL(`https://maps.google.com/?q=${q}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Cover */}
        <View style={{ height: 240 }}>
          <Image source={{ uri: event.cover }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]} style={StyleSheet.absoluteFill} />
          <View style={{ flex: 1, padding: spacing.xl, paddingTop: insets.top + 8, justifyContent: "space-between" }}>
            <Pressable testID="event-back" onPress={() => router.back()} hitSlop={8} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Tag label={event.type} tone="brand" />
                <Txt weight="semibold" size={13} color="rgba(255,255,255,0.9)">
                  {event.groupName}
                </Txt>
              </View>
              <Txt weight="extrabold" size={24} color="#fff" style={{ marginTop: 6 }}>
                {event.title}
              </Txt>
            </View>
          </View>
        </View>

        {/* Live banner */}
        {live && live.status === "live" && (
          <View style={{ marginHorizontal: spacing.xl, marginTop: 16, backgroundColor: colors.surfaceInverse, borderRadius: radius.lg, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error }} />
                <Txt weight="bold" size={12} color={colors.error} style={{ letterSpacing: 0.6 }}>
                  LIVE
                </Txt>
              </View>
              <Txt weight="medium" size={12} color={colors.onSurfaceInverse} mono style={{ opacity: 0.7 }}>
                {live.clock}
              </Txt>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 12 }}>
              <View style={{ alignItems: "center" }}>
                <Txt weight="bold" size={15} color={colors.onSurfaceInverse}>
                  {live.homeName}
                </Txt>
                <Txt weight="extrabold" size={40} color={colors.onSurfaceInverse} mono>
                  {live.homeScore}
                </Txt>
              </View>
              <Txt weight="bold" size={16} color={colors.onSurfaceInverse} style={{ opacity: 0.5 }}>
                :
              </Txt>
              <View style={{ alignItems: "center" }}>
                <Txt weight="bold" size={15} color={colors.onSurfaceInverse}>
                  {live.awayName}
                </Txt>
                <Txt weight="extrabold" size={40} color={colors.onSurfaceInverse} mono>
                  {live.awayScore}
                </Txt>
              </View>
            </View>
          </View>
        )}

        {/* When & where */}
        <View style={{ padding: spacing.xl, gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="time" size={22} color={colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt weight="bold" size={15}>
                {formatEventTime(event.start)}
              </Txt>
              <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
                {event.durationMin} min · starts in {countdown(event.start)}
              </Txt>
            </View>
          </View>

          <Pressable testID="event-directions" onPress={openMaps} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="location" size={22} color={colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt weight="bold" size={15}>
                {event.venue}
              </Txt>
              <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
                {event.address}
              </Txt>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.brandSecondary, paddingHorizontal: 12, height: 34, borderRadius: 17 }}>
              <Ionicons name="navigate" size={14} color={colors.onBrandSecondary} />
              <Txt weight="bold" size={12} color={colors.onBrandSecondary}>
                Directions
              </Txt>
            </View>
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="partly-sunny" size={22} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt weight="bold" size={15}>
                {event.weather.tempF}° · {event.weather.condition}
              </Txt>
              <Txt weight="medium" size={13} color={colors.onSurfaceTertiary}>
                {event.weather.precip}% chance of rain at game time
              </Txt>
            </View>
          </View>
        </View>

        {/* Participation */}
        <View style={{ paddingHorizontal: spacing.xl }}>
          {!isReg ? (
            <>
              <Txt weight="extrabold" size={17} style={{ marginBottom: 10 }}>
                Your RSVP
              </Txt>
              <RSVPControl value={rsvp} onChange={setRsvp} testID="event-rsvp" />
              <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
                  <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>
                    {event.goingCount} going
                  </Txt>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning }} />
                  <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>
                    {event.maybeCount} maybe
                  </Txt>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons name="checkmark-done" size={14} color={colors.brandPrimary} />
                  <Txt weight="semibold" size={13} color={colors.onSurfaceSecondary}>
                    {checkedIn ? event.checkedIn + 1 : event.checkedIn} checked in
                  </Txt>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <Txt weight="extrabold" size={17}>
                  {isPaid ? "Paid Registration" : "Registration"}
                </Txt>
                <Pressable testID="manage-registrations" onPress={() => router.push(`/roster/${event.id}`)} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Ionicons name="people" size={15} color={colors.brandPrimary} />
                  <Txt weight="semibold" size={13} color={colors.brandPrimary}>
                    Manage
                  </Txt>
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12 }}>
                  <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
                    Spots left
                  </Txt>
                  <Txt weight="extrabold" size={18} mono color={colors.brandPrimary}>
                    {Math.max(0, cap - counts.registered)}/{cap}
                  </Txt>
                </View>
                {isPaid && (
                  <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12 }}>
                    <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
                      Price
                    </Txt>
                    <Txt weight="extrabold" size={18} mono>
                      ${price}
                    </Txt>
                  </View>
                )}
                <View style={{ flex: 1.2, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12 }}>
                  <Txt weight="medium" size={11} color={colors.onSurfaceTertiary}>
                    Closes
                  </Txt>
                  <Txt weight="bold" size={13} numberOfLines={1}>
                    {event.registration ? formatEventTime(event.registration.deadline) : "—"}
                  </Txt>
                </View>
              </View>
              {myReg && (
                <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.brandTertiary, borderRadius: radius.md, padding: 12 }}>
                  <Ionicons
                    name={
                      isPaid
                        ? myReg.paid === "confirmed"
                          ? "shield-checkmark"
                          : myReg.paid === "pending"
                            ? "time"
                            : "card"
                        : myReg.status === "waitlisted"
                          ? "hourglass"
                          : "checkmark-circle"
                    }
                    size={18}
                    color={colors.brandPrimary}
                  />
                  <Txt weight="semibold" size={13} color={colors.onBrandTertiary} style={{ flex: 1 }}>
                    {myReg.status === "waitlisted"
                      ? "You're on the waitlist"
                      : isPaid
                        ? myReg.paid === "confirmed"
                          ? "Registered · Payment confirmed"
                          : myReg.paid === "pending"
                            ? "Registered · Payment pending confirmation"
                            : "Registered · Payment due"
                        : "You're registered"}
                  </Txt>
                </View>
              )}
            </>
          )}
        </View>

        {/* Attendees */}
        <View style={{ paddingHorizontal: spacing.xl, marginTop: 20, flexDirection: "row", alignItems: "center" }}>
          {members.slice(0, 6).map((m, i) => (
            <View key={m.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
              <Avatar uri={m.avatar} size={38} />
            </View>
          ))}
          <Txt weight="medium" size={13} color={colors.onSurfaceTertiary} style={{ marginLeft: 8 }}>
            and {event.goingCount - 6} others
          </Txt>
        </View>

        {/* Volunteers */}
        {event.volunteersNeeded && (
          <View style={{ marginTop: 24, paddingHorizontal: spacing.xl }}>
            <Txt weight="extrabold" size={17} style={{ marginBottom: 12 }}>
              Volunteer Slots
            </Txt>
            <View style={{ gap: 10 }}>
              {event.volunteersNeeded.map((v, i) => {
                const full = v.filled >= v.total;
                return (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 14 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="hand-left" size={19} color={colors.brandPrimary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt weight="bold" size={14}>
                        {v.label}
                      </Txt>
                      <Txt weight="medium" size={12} color={colors.onSurfaceTertiary}>
                        {v.filled}/{v.total} filled
                      </Txt>
                    </View>
                    <Pressable
                      testID={`volunteer-${i}`}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      disabled={full}
                      style={{ paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: full ? colors.surfaceTertiary : colors.brandPrimary, alignItems: "center", justifyContent: "center" }}
                    >
                      <Txt weight="bold" size={13} color={full ? colors.onSurfaceTertiary : colors.onBrandPrimary}>
                        {full ? "Filled" : "Claim"}
                      </Txt>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.xl, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
        {isReg ? (
          <Pressable
            testID="event-register-btn"
            onPress={() => router.push(`/register/${event.id}`)}
            style={{ height: 54, borderRadius: radius.md, backgroundColor: colors.brandPrimary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Ionicons name={myReg ? "receipt" : "create"} size={20} color={colors.onBrandPrimary} />
            <Txt weight="bold" size={16} color={colors.onBrandPrimary}>
              {myReg
                ? "View My Registration"
                : isPaid
                  ? `Register & Pay $${price}`
                  : "Register Now"}
            </Txt>
          </Pressable>
        ) : (
          <Pressable
            testID="checkin-btn"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setCheckedIn(true);
            }}
            style={{ height: 54, borderRadius: radius.md, backgroundColor: checkedIn ? colors.success : colors.brandPrimary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Ionicons name={checkedIn ? "checkmark-circle" : "qr-code"} size={20} color="#fff" />
            <Txt weight="bold" size={16} color="#fff">
              {checkedIn ? "You're Checked In" : "Check In"}
            </Txt>
          </Pressable>
        )}
      </View>
    </View>
  );
}
