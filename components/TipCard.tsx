import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";
import { type MoodId } from "@/constants/moods";

const GENERAL_TIPS: string[] = [
  "Close your eyes, unclench your jaw, and take 5 slow breaths in and out through your nose.",
  "Pick one small action you can complete in under 10 minutes—then stop and notice how you feel.",
  "Relax your shoulders and let your exhale be a little longer than your inhale.",
  "Try a 60-second reset: breathe slowly, then name one kind next step.",
];

const TIPS_BY_MOOD: Partial<Record<MoodId, string[]>> = {
  happy: [
    "Write down one thing you’re grateful for, then choose the smallest way to support it today.",
    "Take a quick moment to celebrate progress before you move on.",
  ],
  neutral: [
    "Do a “mindful check”: what do you need most right now—rest, connection, or clarity?",
    "Choose one gentle intention and make it easy to follow through.",
  ],
  sad: [
    "Be extra kind: speak to yourself like you would to a friend.",
    "Try 2 minutes of slow breathing and let your body soften between breaths.",
  ],
  anxious: [
    "Ground with the 5-4-3-2-1 senses: notice what you see, feel, hear, smell, and taste.",
    "Breathe in for 4, hold for 2, exhale for 6. Repeat 5 times.",
  ],
  angry: [
    "Pause and name it: “I’m feeling angry.” Then take 3 slow breaths before any action.",
    "Tense your fists for 5 seconds, then release slowly. Repeat a few times.",
  ],
};

function getDayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function TipCard({ moodId }: { moodId: MoodId }) {
  const tip = useMemo(() => {
    const now = new Date();
    const day = getDayOfYear(now);
    const list = TIPS_BY_MOOD[moodId] ?? GENERAL_TIPS;
    return list[day % list.length] ?? GENERAL_TIPS[0]!;
  }, [moodId]);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Tip for today</Text>
      <Text style={styles.title}>A small practice to support you</Text>
      <Text style={styles.body}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: NAFS.grey,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: NAFS.navy,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: NAFS.grey,
    lineHeight: 20,
    fontWeight: "700",
  },
});

