import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";
import { type MoodId } from "@/constants/moods";

type Quote = { text: string; author?: string };

const QUOTES: Quote[] = [
  { text: "Small steps still count.", author: "NAFS" },
  { text: "Progress is quiet. Keep showing up.", author: "NAFS" },
  { text: "You are allowed to take up space—starting with your breath.", author: "NAFS" },
  { text: "Gentle effort beats perfect timing.", author: "NAFS" },
  { text: "It’s okay if today is a reset day.", author: "NAFS" },
  { text: "Kindness to yourself is a skill you can practice.", author: "NAFS" },
];

const QUOTES_BY_MOOD: Partial<Record<MoodId, Quote[]>> = {
  happy: [
    { text: "Your energy is a gift—spend it on what grows you.", author: "NAFS" },
    { text: "Keep the good momentum going, one intention at a time.", author: "NAFS" },
  ],
  neutral: [
    { text: "Steady steps are powerful. Stay with what matters.", author: "NAFS" },
    { text: "Neutral is a place to choose your next kind action.", author: "NAFS" },
  ],
  sad: [
    { text: "Be gentle. You don’t have to rush your healing.", author: "NAFS" },
    { text: "Soft support counts as real progress.", author: "NAFS" },
  ],
  anxious: [
    { text: "Breathe first. Then decide what the next step can be.", author: "NAFS" },
    { text: "You are safe in this moment. Return to your breath.", author: "NAFS" },
  ],
  angry: [
    { text: "Pause before you react. Regulate before you respond.", author: "NAFS" },
    { text: "Channel your strength into something safe and honest.", author: "NAFS" },
  ],
};

function getDayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function QuoteCard({ moodId }: { moodId: MoodId }) {
  const quote = useMemo(() => {
    const now = new Date();
    const day = getDayOfYear(now);
    const list = QUOTES_BY_MOOD[moodId] ?? QUOTES;
    return list[day % list.length] ?? QUOTES[0]!;
  }, [moodId]);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Quote of the Day</Text>
      <Text style={styles.quoteText}>{quote.text}</Text>
      {quote.author ? <Text style={styles.author}>— {quote.author}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.lightBg,
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
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: "800",
    color: NAFS.navy,
    lineHeight: 22,
    fontStyle: "italic",
  },
  author: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: NAFS.grey,
  },
});

