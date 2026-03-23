import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NAFS } from "@/constants/theme";

export type MoodHistoryItemProps = {
  dayLabel: string;
  emoji: string;
  isDark: boolean;
};

export const MoodHistoryItem = memo(function MoodHistoryItem({
  dayLabel,
  emoji,
  isDark,
}: MoodHistoryItemProps) {
  const bg = isDark ? "#1E2140" : NAFS.white;
  const borderColor = isDark ? "#2A2D4A" : NAFS.greyLight;
  const textColor = isDark ? NAFS.white : NAFS.navy;

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor }]}>
      <Text style={[styles.day, { color: textColor }]}>{dayLabel}</Text>
      <Text style={styles.emoji} accessibilityLabel={`Mood: ${emoji}`}>
        {emoji}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 74,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  day: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
  },
  emoji: {
    fontSize: 30,
  },
});

