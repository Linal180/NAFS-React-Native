export type MoodId = "happy" | "neutral" | "sad" | "anxious" | "angry";

export type MoodMeta = {
  id: MoodId;
  label: string;
  emoji: string;
  color: string;
};

export const MOODS: MoodMeta[] = [
  { id: "happy", label: "Happy", emoji: "😀", color: "#22C55E" },
  { id: "neutral", label: "Neutral", emoji: "🙂", color: "#64748B" },
  { id: "sad", label: "Sad", emoji: "😔", color: "#3B82F6" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#F59E0B" },
  { id: "angry", label: "Angry", emoji: "😡", color: "#EF4444" },
];

const moodLabelToId: Record<string, MoodId> = {
  Happy: "happy",
  Neutral: "neutral",
  Sad: "sad",
  Anxious: "anxious",
  Angry: "angry",

  // MoodResult screen labels (subset) -> our home mood ids
  Calm: "neutral",
  "Surprised": "anxious",
  Tired: "sad",
};

export function normalizeMoodId(mood?: string): MoodId {
  if (!mood) return "neutral";
  const trimmed = mood.trim();
  const lower = trimmed.toLowerCase();

  const byId = MOODS.find((m) => m.id === lower);
  if (byId) return byId.id;

  const byLabel = moodLabelToId[trimmed] ?? moodLabelToId[trimmed[0]?.toUpperCase() + trimmed.slice(1)];
  return byLabel ?? "neutral";
}

export function getMoodMeta(moodId: MoodId): MoodMeta {
  return MOODS.find((m) => m.id === moodId) ?? MOODS[1]!;
}

