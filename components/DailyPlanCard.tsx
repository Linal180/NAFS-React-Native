import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";
import { getMoodMeta, type MoodId } from "@/constants/moods";
import {
  getDailyPlanSections,
  MOOD_PLAN_SUMMARY,
  type DailyPlanTask,
} from "@/constants/daily-plan-data";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type DailyPlanCardProps = {
  moodId: MoodId;
  onPressViewPlan: () => void;
  title?: string;
};

export function DailyPlanCard({ moodId, onPressViewPlan, title }: DailyPlanCardProps) {
  const router = useRouter();
  const meta = getMoodMeta(moodId);
  const sections = useMemo(() => getDailyPlanSections(moodId), [moodId]);
  const summary = MOOD_PLAN_SUMMARY[moodId];
  const topTasks = useMemo(() => {
    const tasks = sections.flatMap((s) => s.tasks);
    return tasks.slice(0, 5);
  }, [sections]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.moodPill, { backgroundColor: meta.color + "12" }]}>
          <Text style={styles.moodEmoji}>{meta.emoji}</Text>
          <Text style={[styles.moodLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Personalized for you</Text>
        </View>
      </View>

      <Text style={styles.title}>{title || "Today's Plan"}</Text>
      <Text style={styles.subtitle}>{summary}</Text>

      <View style={styles.tasksCard}>
        {topTasks.map((task, index) => (
          <Pressable
            key={task.key}
            onPress={() =>
              router.push({
                pathname: task.screen as any,
                params: task.params,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Open activity: ${task.title}`}
            style={({ pressed }) => [
              styles.taskRow,
              index === 0 && styles.taskRowFirst,
              {
                backgroundColor: pressed ? NAFS.lightBg : "transparent",
                transform: [{ scale: pressed ? 0.99 : 1 }],
              },
            ]}
          >
            <View style={[styles.taskIconWrap, { backgroundColor: meta.color + "14" }]}>
              <MaterialCommunityIcons name={task.icon as any} size={18} color={meta.color} />
            </View>
            <View style={styles.taskTextWrap}>
              <Text style={styles.taskTitle} numberOfLines={1}>
                {task.title}
              </Text>
              <Text style={styles.taskDesc} numberOfLines={1}>
                {task.description}
              </Text>
            </View>
            <Text style={styles.taskChevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={onPressViewPlan}
        accessibilityRole="button"
        accessibilityLabel="View full daily plan"
        style={({ pressed }) => [
          styles.viewPlanButton,
          { backgroundColor: meta.color },
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        <Text style={styles.viewPlanButtonText}>View full plan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  moodEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  badge: {
    backgroundColor: NAFS.lightBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: NAFS.grey,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: NAFS.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: NAFS.grey,
    lineHeight: 19,
    marginBottom: 14,
  },
  tasksCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
    backgroundColor: NAFS.white,
    overflow: "hidden",
    marginBottom: 14,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: NAFS.greyLight,
  },
  taskRowFirst: {
    borderTopWidth: 0,
  },
  taskIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  taskTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: NAFS.navy,
  },
  taskDesc: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: NAFS.grey,
  },
  taskChevron: {
    fontSize: 22,
    color: NAFS.grey,
    marginLeft: 4,
    marginTop: -2,
  },
  viewPlanButton: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  viewPlanButtonText: {
    color: NAFS.white,
    fontSize: 15,
    fontWeight: "900",
  },
});

