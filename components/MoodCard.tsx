import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";

export type MoodCardProps = {
  day: string;
  emoji: string;
  score: number; // 0-100
};

function getBarColor(score: number) {
  if (score >= 75) return NAFS.success;
  if (score >= 50) return NAFS.blue;
  return NAFS.error;
}

export const MoodCard = memo(function MoodCard({
  day,
  emoji,
  score,
}: MoodCardProps) {
  const barColor = useMemo(() => getBarColor(score), [score]);
  const clampedScore = Math.max(0, Math.min(100, score));
  const widthPct = (clampedScore / 100) * 100;

  return (
    <View style={styles.card}>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.emojiText} accessibilityLabel={`Mood: ${emoji}`}>
        {emoji}
      </Text>

      <View style={styles.barTrack} accessibilityElementsHidden>
        <View
          style={[
            styles.barFill,
            {
              width: `${widthPct}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 56,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: NAFS.white,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
    alignItems: "center",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  dayText: {
    fontSize: 11,
    fontWeight: "800",
    color: NAFS.grey,
    marginBottom: 4,
  },
  emojiText: {
    fontSize: 26,
    marginBottom: 8,
  },
  barTrack: {
    width: 40,
    height: 6,
    borderRadius: 999,
    backgroundColor: NAFS.greyLight,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
});

