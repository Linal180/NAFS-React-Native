import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MoodId } from "@/constants/moods";

export type LocalMoodHistoryEntry = {
  id: string;
  moodId: MoodId;
  timestamp: string; // ISO
};

const SELECTED_MOOD_KEY = "nafs_selected_mood_v1";
const MOOD_HISTORY_KEY = "nafs_mood_history_v1";

function isMoodId(value: unknown): value is MoodId {
  return value === "happy" || value === "neutral" || value === "sad" || value === "anxious" || value === "angry";
}

export async function loadLocalMoodState(): Promise<{
  selectedMoodId: MoodId;
  moodHistory: LocalMoodHistoryEntry[];
}> {
  try {
    const [selectedMoodRaw, historyRaw] = await Promise.all([
      AsyncStorage.getItem(SELECTED_MOOD_KEY),
      AsyncStorage.getItem(MOOD_HISTORY_KEY),
    ]);

    const selectedMoodId: MoodId = isMoodId(selectedMoodRaw) ? selectedMoodRaw : "neutral";

    let moodHistory: LocalMoodHistoryEntry[] = [];
    if (historyRaw) {
      const parsed = JSON.parse(historyRaw) as unknown;
      if (Array.isArray(parsed)) {
        moodHistory = parsed
          .map((e: any) => ({
            id: String(e?.id ?? ""),
            moodId: e?.moodId,
            timestamp: String(e?.timestamp ?? ""),
          }))
          .filter((e) => e.id && isMoodId(e.moodId) && e.timestamp)
          .slice(0, 5);
      }
    }

    return { selectedMoodId, moodHistory };
  } catch {
    return { selectedMoodId: "neutral", moodHistory: [] };
  }
}

export async function persistSelectedMood(selectedMoodId: MoodId): Promise<void> {
  await AsyncStorage.setItem(SELECTED_MOOD_KEY, selectedMoodId);
}

export async function persistMoodHistory(moodHistory: LocalMoodHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(moodHistory.slice(0, 5)));
}

