import type { ComponentType } from "react";
import {
  BreathingIllustration,
  GratitudeIllustration,
  JournalingIllustration,
  MeditationIllustration,
  RelaxationIllustration,
  StressReliefIllustration,
} from "@/components/ExerciseIllustrations";
import {
  BreathingIcon,
  ExerciseIcon,
  GratitudeIcon,
  JournalIcon,
  MeditationIcon,
  MusicIcon,
} from "@/components/ui/app-icons";

export type ExerciseStep = {
  title: string;
  description: string;
  /**
   * Optional duration for this step (in seconds).
   * If omitted, the flow will wait for the user to tap Next.
   */
  seconds?: number;
};

export type ExerciseDefinition = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: ComponentType<{ size: number; color: string }>;
  steps: ExerciseStep[];
  Illustration: ComponentType<{ size?: number; color?: string }>;
};

export const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  {
    id: "deep-breathing",
    title: "Deep Breathing",
    subtitle: "Slow your breath and settle your body.",
    color: "#26A69A",
    icon: BreathingIcon,
    Illustration: BreathingIllustration,
    steps: [
      { title: "Get comfortable", description: "Sit upright or lie down. Relax your shoulders.", seconds: 10 },
      { title: "Inhale slowly", description: "Breathe in through your nose. Let your belly rise.", seconds: 4 },
      { title: "Hold", description: "Pause gently. No strain.", seconds: 2 },
      { title: "Exhale longer", description: "Breathe out slowly through your mouth.", seconds: 6 },
      { title: "Repeat", description: "Stay with this rhythm. If you lose it, just restart.", seconds: 48 },
    ],
  },
  {
    id: "positive-journaling",
    title: "Positive Journaling",
    subtitle: "Write one small truth that supports you today.",
    color: "#5C6BC0",
    icon: JournalIcon,
    Illustration: JournalingIllustration,
    steps: [
      { title: "Choose your prompt", description: "Pick one: “I handled ___ well today” or “I’m proud of ___.”" },
      { title: "Write without editing", description: "Write 5–7 lines. Don’t worry about perfect words.", seconds: 120 },
      { title: "Name one next step", description: "Write a tiny action you can do in under 5 minutes." },
      { title: "Close kindly", description: "End with: “It’s okay to go slowly.”", seconds: 10 },
    ],
  },
  {
    id: "mindful-meditation",
    title: "Mindful Meditation",
    subtitle: "Return to the present moment, gently.",
    color: "#AB47BC",
    icon: MeditationIcon,
    Illustration: MeditationIllustration,
    steps: [
      { title: "Posture", description: "Sit tall. Hands relaxed. Eyes soft or closed.", seconds: 10 },
      { title: "Anchor", description: "Notice your breath at the nose or belly.", seconds: 30 },
      { title: "Wandering is normal", description: "When your mind drifts, label it “thinking” and return." },
      { title: "Body scan", description: "Soften jaw, shoulders, chest, belly.", seconds: 45 },
      { title: "Finish", description: "Take one deeper breath and open your eyes.", seconds: 10 },
    ],
  },
  {
    id: "stress-relief-exercise",
    title: "Stress Relief Exercise",
    subtitle: "Release tension with a quick reset routine.",
    color: "#EF5350",
    icon: ExerciseIcon,
    Illustration: StressReliefIllustration,
    steps: [
      { title: "Shake it out", description: "Shake hands and arms loosely to release tension.", seconds: 20 },
      { title: "Neck rolls", description: "Slow circles. 3 each direction. Keep it gentle.", seconds: 30 },
      { title: "Shoulder squeeze", description: "Lift shoulders up to ears… then drop.", seconds: 20 },
      { title: "Forward fold", description: "Bend forward softly. Let your head hang heavy.", seconds: 25 },
      { title: "Reset breath", description: "Inhale 4, exhale 6. Keep it easy.", seconds: 45 },
    ],
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    subtitle: "Shift attention to what’s supporting you.",
    color: "#FFB74D",
    icon: GratitudeIcon,
    Illustration: GratitudeIllustration,
    steps: [
      { title: "Name 3 things", description: "Three small things you appreciate right now." },
      { title: "Add one “why”", description: "Pick one item and write why it matters to you.", seconds: 45 },
      { title: "Thank someone (optional)", description: "Send a short message to a friend or family member." },
      { title: "Notice the feeling", description: "Where do you feel warmth or ease in your body?", seconds: 20 },
    ],
  },
  {
    id: "relaxation-sounds",
    title: "Relaxation Sounds",
    subtitle: "Create a calm atmosphere and slow down.",
    color: "#42A5F5",
    icon: MusicIcon,
    Illustration: RelaxationIllustration,
    steps: [
      { title: "Set the space", description: "Lower your screen brightness and get comfortable.", seconds: 10 },
      { title: "Pick a sound", description: "Rain, ocean, fan noise—anything that feels neutral." },
      { title: "Listen and breathe", description: "Let the sound be your anchor. Inhale 4, exhale 6.", seconds: 90 },
      { title: "Close", description: "One deep breath. Notice: what feels 1% softer?", seconds: 10 },
    ],
  },
];

export function getExerciseById(id: string | undefined): ExerciseDefinition | undefined {
  if (!id) return undefined;
  return EXERCISE_DEFINITIONS.find((e) => e.id === id);
}

