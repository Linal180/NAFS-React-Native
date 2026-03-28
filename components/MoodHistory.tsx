import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";
import { getMoodMeta } from "@/constants/moods";
import type { LocalMoodHistoryEntry } from "@/lib/local-mood-history";

export function MoodHistory({ history }: { history: LocalMoodHistoryEntry[] }) {
  const lastCount = useMemo(() => Math.min(history.length, 5), [history.length]);
  const now = useMemo(() => Date.now(), []);

  const formatRelative = (iso: string) => {
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return "";
    const diffMs = Math.max(0, now - t);
    const minutes = Math.round(diffMs / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>Mood history</Text>
        <Text style={styles.counter}>Last {lastCount} moods</Text>
      </View>

      {history.length === 0 ? (
        <Text style={styles.empty}>Your recent moods will appear here after your first check-in.</Text>
      ) : (
        <View style={styles.emojiRow}>
          {history.slice(0, 5).map((entry) => {
            const meta = getMoodMeta(entry.moodId);
            const rel = formatRelative(entry.timestamp);
            return (
              <View key={entry.id} style={styles.emojiChip} accessibilityLabel={meta.label}>
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <Text style={styles.time} numberOfLines={1}>
                  {rel}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: NAFS.grey,
  },
  counter: {
    fontSize: 12,
    color: NAFS.grey,
    fontWeight: "800",
  },
  empty: {
    fontSize: 13,
    color: NAFS.grey,
    lineHeight: 18,
    fontWeight: "700",
    paddingVertical: 10,
  },
  emojiRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  emojiChip: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: NAFS.lightBg,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
  },
  time: {
    position: "absolute",
    bottom: 4,
    fontSize: 10,
    fontWeight: "900",
    color: NAFS.grey,
  },
});

