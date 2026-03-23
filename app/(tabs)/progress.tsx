import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { NAFS } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getMoodHistory, type StoredMoodEntry } from "@/lib/mood-storage";
import { MoodCard } from "@/components/MoodCard";
import { StatCard } from "@/components/StatCard";

type MoodDay = {
  dayKey: string;
  day: string;
  emoji: string;
  score: number; // 0-100
  hasEntry: boolean;
};

const MOCK_MOOD_EMOJIS = ["🙂", "😐", "🙂", "😔", "😐", "🙂", "😔"] as const;
const MOCK_STATS = {
  completedExercises: 12,
  activeDays: 5,
  moodImprovement: 15,
} as const;

const MOOD_TO_EMOJI: Record<string, string> = {
  Happy: "🙂",
  Calm: "🙂",
  Neutral: "😐",
  Surprised: "😐",
  Tired: "😔",
  Sad: "😔",
  Anxious: "😔",
  Angry: "😔",
};

function getDayKeyLocal(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getLast7Days(now = new Date()) {
  const days: Array<{ dayKey: string; day: string }> = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset);
    days.push({
      dayKey: getDayKeyLocal(d),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

function emojiToScore(emoji: string) {
  switch (emoji) {
    case "🙂":
    case "😄":
      return 90;
    case "😐":
    case "😌":
      return 55;
    case "😔":
    case "😢":
    case "😟":
      return 25;
    case "😡":
      return 15;
    default:
      return 50;
  }
}

function getEmojiForEntry(entry: StoredMoodEntry | undefined, fallbackEmoji: string) {
  if (!entry) return fallbackEmoji;
  return entry.emoji || MOOD_TO_EMOJI[entry.mood] || fallbackEmoji;
}

function buildMoodDays(entries: StoredMoodEntry[], mockEmojisByIndex: readonly string[]): MoodDay[] {
  const last7 = getLast7Days();
  const byDay = new Map<string, StoredMoodEntry>();

  for (const e of entries) {
    const key = getDayKeyLocal(e.timestamp);
    const existing = byDay.get(key);
    if (!existing || e.timestamp > existing.timestamp) {
      byDay.set(key, e);
    }
  }

  return last7.map((d, idx) => {
    const entry = byDay.get(d.dayKey);
    const fallbackEmoji = mockEmojisByIndex[idx] ?? "😐";
    const emoji = getEmojiForEntry(entry, fallbackEmoji);
    return {
      dayKey: d.dayKey,
      day: d.day,
      emoji,
      score: emojiToScore(emoji),
      hasEntry: Boolean(entry),
    };
  });
}

function computeMoodImprovementPercent(moodDays: MoodDay[]) {
  const first = moodDays.slice(0, 3);
  const last = moodDays.slice(3);
  const avg = (arr: MoodDay[]) =>
    arr.reduce((sum, d) => sum + d.score, 0) / Math.max(1, arr.length);

  const oldAvg = avg(first);
  const newAvg = avg(last);
  const pct = ((newAvg - oldAvg) / Math.max(oldAvg, 1)) * 100;
  if (!Number.isFinite(pct)) return MOCK_STATS.moodImprovement;
  return Math.round(pct);
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

export default function ProgressScreen() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<StoredMoodEntry[]>([]);
  const [moodDays, setMoodDays] = useState<MoodDay[]>(() =>
    buildMoodDays([], MOCK_MOOD_EMOJIS),
  );
  const [stats, setStats] = useState(() => ({
    completedExercises: MOCK_STATS.completedExercises,
    activeDays: MOCK_STATS.activeDays,
    moodImprovement: MOCK_STATS.moodImprovement,
  }));
  const [dataSource, setDataSource] = useState<"mock" | "live">("mock");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!user) {
        setEntries([]);
        setDataSource("mock");
        return () => {
          active = false;
        };
      }

      // Fetch live mood data (no blocking spinner; UI renders mock immediately).
      getMoodHistory(user.uid, 30)
        .then((data) => {
          if (!active) return;
          setEntries(data);
          setDataSource(data.length > 0 ? "live" : "mock");
        })
        .catch((e) => {
          console.warn("Failed to load mood history:", e);
          if (!active) return;
          setEntries([]);
          setDataSource("mock");
        });

      return () => {
        active = false;
      };
    }, [user]),
  );

  useEffect(() => {
    const computedMoodDays = buildMoodDays(entries, MOCK_MOOD_EMOJIS);
    const activeDays =
      entries.length > 0
        ? computedMoodDays.filter((d) => d.hasEntry).length
        : MOCK_STATS.activeDays;
    const moodImprovement =
      entries.length > 0
        ? computeMoodImprovementPercent(computedMoodDays)
        : MOCK_STATS.moodImprovement;

    setMoodDays(computedMoodDays);
    setStats({
      completedExercises: MOCK_STATS.completedExercises,
      activeDays,
      moodImprovement,
    });
  }, [entries]);

  const trendText = useMemo(() => {
    if (stats.moodImprovement > 0) return "Improving";
    if (stats.moodImprovement < 0) return "Needs attention";
    return "Steady";
  }, [stats.moodImprovement]);

  const statCards = useMemo(() => {
    const moodAccent = stats.moodImprovement >= 0 ? NAFS.success : NAFS.error;

    return [
      {
        key: "completed",
        value: stats.completedExercises,
        label: "Completed Exercises",
        icon: "dumbbell" as ComponentProps<typeof MaterialCommunityIcons>["name"],
        accentColor: "#4CAF50",
        subLabel: "This week",
      },
      {
        key: "activeDays",
        value: `${stats.activeDays}`,
        label: "Active Days",
        icon: "calendar-check" as ComponentProps<typeof MaterialCommunityIcons>["name"],
        accentColor: NAFS.blue,
        subLabel: "With mood check-ins",
      },
      {
        key: "moodImprovement",
        value: formatSignedPercent(stats.moodImprovement),
        label: "Mood Improvement",
        icon: stats.moodImprovement >= 0 ? ("trending-up" as ComponentProps<typeof MaterialCommunityIcons>["name"]) : ("trending-down" as ComponentProps<typeof MaterialCommunityIcons>["name"]),
        accentColor: moodAccent,
        subLabel: trendText,
      },
    ];
  }, [stats.activeDays, stats.completedExercises, stats.moodImprovement, trendText]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/nafs_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Progress Dashboard</Text>
          <Text style={styles.subtitle}>Mood trends + activity stats</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Daily Mood (Last 7 Days)</Text>
            <View style={[styles.pill, { backgroundColor: dataSource === "live" ? NAFS.blue + "14" : NAFS.greyLight }]}>
              <Text style={styles.pillText}>{dataSource === "live" ? "Live data" : "Mock data"}</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodRow}
          >
            {moodDays.map((d) => (
              <MoodCard key={d.dayKey} day={d.day} emoji={d.emoji} score={d.score} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsGrid}>
          {statCards.map((c) => (
            <View key={c.key} style={styles.statsGridItem}>
              <StatCard value={c.value} label={c.label} icon={c.icon} accentColor={c.accentColor} subLabel={c.subLabel} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 6,
  },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "900",
    color: NAFS.blue,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: NAFS.grey,
  },
  sectionCard: {
    backgroundColor: NAFS.white,
    borderRadius: 26,
    padding: 16,
    marginBottom: 18,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: NAFS.navy,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "900",
    color: NAFS.grey,
  },
  moodRow: {
    paddingVertical: 6,
    gap: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  statsGridItem: {
    width: "48%",
  },
});
