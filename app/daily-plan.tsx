import { NAFS } from "@/constants/theme";
import { getMoodMeta, normalizeMoodId } from "@/constants/moods";
import { PlanCard } from "@/components/PlanCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuoteCard } from "@/components/QuoteCard";

export default function DailyPlanScreen() {
  const router = useRouter();
  const { mood, emoji } = useLocalSearchParams<{ mood?: string; emoji?: string }>();

  const moodId = normalizeMoodId(mood);
  const meta = getMoodMeta(moodId);
  const currentEmoji = emoji ?? meta.emoji;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/nafs_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Daily Plan</Text>
          <Text style={styles.subtitle}>
            {currentEmoji} Today&apos;s support plan for{" "}
            <Text style={styles.subtitleStrong}>{meta.label}</Text>
          </Text>
        </View>

        <View style={styles.pillRow}>
          <View style={[styles.moodPill, { backgroundColor: meta.color + "12", borderColor: meta.color + "35" }]}>
            <Text style={styles.pillEmoji}>{meta.emoji}</Text>
            <Text style={[styles.pillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <View style={styles.dayPill}>
            <Text style={styles.dayPillText}>Today</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily guidance</Text>

        <View style={styles.cards}>
          <PlanCard
            title="Morning Reset"
            description="Start soft: 60 seconds to slow your breath and settle your body."
            icon={"weather-windy"}
            recommended
            onPress={() => router.push("/breathing-exercise")}
          />

          <PlanCard
            title="Today’s Goals"
            description="Pick 1 priority and break it into a tiny, doable next step."
            icon={"target"}
            onPress={() =>
              router.push({
                pathname: "/exercise-tips",
                params: { topic: "journaling", title: "Today’s Goals" },
              })
            }
          />

          <PlanCard
            title="Breathing Exercise"
            description="A quick breathing routine to calm your nervous system."
            icon={"weather-windy"}
            onPress={() => router.push("/breathing-exercise")}
          />

          <PlanCard
            title="Meditation"
            description="Return to the present moment with a short guided practice."
            icon={"meditation"}
            onPress={() => router.push("/meditation")}
          />

          <PlanCard
            title="Motivational Quote"
            description="A daily reminder to stay kind to yourself and keep going."
            icon={"format-quote-close"}
            onPress={() =>
              router.push({
                pathname: "/exercise-tips",
                params: { topic: "gratitude", title: "Motivational Quote" },
              })
            }
          />
        </View>

        <QuoteCard moodId={moodId} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  header: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 18,
  },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: NAFS.navy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: NAFS.grey,
    textAlign: "center",
    lineHeight: 18,
  },
  subtitleStrong: {
    color: NAFS.navy,
    fontWeight: "800",
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: NAFS.white,
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "900",
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: NAFS.white,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  dayPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: NAFS.grey,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: NAFS.navy,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  cards: {
    gap: 12,
    marginBottom: 14,
  },
});

