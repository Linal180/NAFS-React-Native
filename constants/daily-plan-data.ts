import type { MoodId } from "./moods";

export type TimeOfDay = "morning" | "afternoon" | "evening";

export type DailyPlanTask = {
  key: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
  params?: Record<string, string>;
};

export type DailyPlanSection = {
  timeOfDay: TimeOfDay;
  title: string;
  tasks: DailyPlanTask[];
};

export const MOOD_PLAN_SUMMARY: Record<MoodId, string> = {
  happy:
    "Lean into your positive energy and create space for gratitude and momentum.",
  neutral: "Small, intentional steps can gently lift your day—one choice at a time.",
  sad: "Be gentle with yourself today. Soft care and light movement are enough.",
  anxious: "Ground your nervous system with breathing, presence, and simple structure.",
  angry: "Pause, regulate, and channel your energy into safe actions and reflection.",
};

const EXERCISE_TIPS_SCREEN = "/exercise-tips";

// Note: we reuse existing routes + `topic` values from `app/exercise-tips.tsx`.
export const DAILY_PLAN_BY_MOOD: Record<MoodId, DailyPlanSection[]> = {
  happy: [
    {
      timeOfDay: "morning",
      title: "Morning",
      tasks: [
        {
          key: "happy-morning-1",
          title: "Productivity Focus",
          description: "Pick one priority and make it smaller than you think.",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "journaling", title: "Productivity Focus" },
        },
        {
          key: "happy-morning-2",
          title: "Tiny Win Setup",
          description: "Choose a 5-minute task you can complete right now.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Tiny Win Setup" },
        },
      ],
    },
    {
      timeOfDay: "afternoon",
      title: "Afternoon",
      tasks: [
        {
          key: "happy-afternoon-1",
          title: "Gratitude Moment",
          description: "Name 3 things you appreciate today—no matter how small.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "gratitude", title: "Gratitude Moment" },
        },
        {
          key: "happy-afternoon-2",
          title: "Progress Check",
          description: "Write one sentence: what’s going well right now?",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "journaling", title: "Progress Check" },
        },
      ],
    },
    {
      timeOfDay: "evening",
      title: "Evening",
      tasks: [
        {
          key: "happy-evening-1",
          title: "Gentle Reflection",
          description: "Celebrate one win and set a kind intention for tomorrow.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Gentle Reflection" },
        },
        {
          key: "happy-evening-2",
          title: "Gratitude Close",
          description: "End with one more thing you’re grateful for.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "gratitude", title: "Gratitude Close" },
        },
      ],
    },
  ],
  neutral: [
    {
      timeOfDay: "morning",
      title: "Morning",
      tasks: [
        {
          key: "neutral-morning-1",
          title: "Start Soft",
          description: "Take 3 slow breaths and pick one gentle intention.",
          icon: "weather-windy",
          screen: "/breathing-exercise",
        },
        {
          key: "neutral-morning-2",
          title: "Mindful Minute",
          description: "Notice 5 things you can see, 4 you can feel, 3 you can hear…",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Mindful Minute" },
        },
      ],
    },
    {
      timeOfDay: "afternoon",
      title: "Afternoon",
      tasks: [
        {
          key: "neutral-afternoon-1",
          title: "Guided Reset",
          description: "A short session to return to the present moment.",
          icon: "meditation",
          screen: "/meditation",
        },
        {
          key: "neutral-afternoon-2",
          title: "Light Journaling",
          description: "Write one kind thing about yourself and why it matters.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "journaling", title: "Light Journaling" },
        },
      ],
    },
    {
      timeOfDay: "evening",
      title: "Evening",
      tasks: [
        {
          key: "neutral-evening-1",
          title: "Relaxation Wind-Down",
          description: "Create a cozy moment and let your body soften.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Relaxation Wind-Down" },
        },
        {
          key: "neutral-evening-2",
          title: "Gratitude Check-Out",
          description: "Name one small good thing before you sleep.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "gratitude", title: "Gratitude Check-Out" },
        },
      ],
    },
  ],
  sad: [
    {
      timeOfDay: "morning",
      title: "Morning",
      tasks: [
        {
          key: "sad-morning-1",
          title: "Self-Compassion Check-in",
          description: "Be kind to yourself: what do you need right now?",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Self-Compassion Check-in" },
        },
        {
          key: "sad-morning-2",
          title: "Gentle Grounding",
          description: "Slow your pace and notice what supports you today.",
          icon: "weather-windy",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Gentle Grounding" },
        },
      ],
    },
    {
      timeOfDay: "afternoon",
      title: "Afternoon",
      tasks: [
        {
          key: "sad-afternoon-1",
          title: "Light Activity",
          description: "Try a short walk or stretch to move gently.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Light Activity" },
        },
        {
          key: "sad-afternoon-2",
          title: "Cozy Care",
          description: "Choose one comforting thing and give it your full attention.",
          icon: "weather-windy",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Cozy Care" },
        },
      ],
    },
    {
      timeOfDay: "evening",
      title: "Evening",
      tasks: [
        {
          key: "sad-evening-1",
          title: "Relaxing Breathing",
          description: "Use slow breaths to soothe your body.",
          icon: "weather-windy",
          screen: "/breathing-exercise",
        },
        {
          key: "sad-evening-2",
          title: "Gratitude for Comfort",
          description: "What helped you, even a little, today?",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "gratitude", title: "Gratitude for Comfort" },
        },
      ],
    },
  ],
  anxious: [
    {
      timeOfDay: "morning",
      title: "Morning",
      tasks: [
        {
          key: "anxious-morning-1",
          title: "Breathing Reset",
          description: "Slow your breath to calm your nervous system.",
          icon: "weather-windy",
          screen: "/breathing-exercise",
        },
        {
          key: "anxious-morning-2",
          title: "Grounding Prompt",
          description: "Anchor in the present with a quick sensory scan.",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Grounding Prompt" },
        },
      ],
    },
    {
      timeOfDay: "afternoon",
      title: "Afternoon",
      tasks: [
        {
          key: "anxious-afternoon-1",
          title: "Mindful Meditation",
          description: "Return to the present moment with guided attention.",
          icon: "meditation",
          screen: "/meditation",
        },
        {
          key: "anxious-afternoon-2",
          title: "Calm Structure",
          description: "Write your next step so your mind can rest.",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "journaling", title: "Calm Structure" },
        },
      ],
    },
    {
      timeOfDay: "evening",
      title: "Evening",
      tasks: [
        {
          key: "anxious-evening-1",
          title: "Slow Wind-Down",
          description: "Relaxation for your body and your breath.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Slow Wind-Down" },
        },
        {
          key: "anxious-evening-2",
          title: "Breath + Presence",
          description: "A final breathing reset before sleep.",
          icon: "weather-windy",
          screen: "/breathing-exercise",
        },
      ],
    },
  ],
  angry: [
    {
      timeOfDay: "morning",
      title: "Morning",
      tasks: [
        {
          key: "angry-morning-1",
          title: "Pause & Regulate",
          description: "Slow your reactions with breathing and a brief reset.",
          icon: "weather-windy",
          screen: "/breathing-exercise",
        },
        {
          key: "angry-morning-2",
          title: "Release Tension",
          description: "Try progressive relaxation to soften muscle tension.",
          icon: "target",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Release Tension" },
        },
      ],
    },
    {
      timeOfDay: "afternoon",
      title: "Afternoon",
      tasks: [
        {
          key: "angry-afternoon-1",
          title: "Safe Outlet Journaling",
          description: "Write what you feel and what you need—without judging it.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "journaling", title: "Safe Outlet Journaling" },
        },
        {
          key: "angry-afternoon-2",
          title: "Reframe One Thing",
          description: "Look for a kinder interpretation to reduce intensity.",
          icon: "weather-sunset-up",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "relaxation", title: "Reframe One Thing" },
        },
      ],
    },
    {
      timeOfDay: "evening",
      title: "Evening",
      tasks: [
        {
          key: "angry-evening-1",
          title: "Calm-Down Exercise",
          description: "Use a stress-relief routine to settle your body.",
          icon: "weather-windy",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "stress-relief", title: "Calm-Down Exercise" },
        },
        {
          key: "angry-evening-2",
          title: "Gratitude Reset",
          description: "End with one thing you can be thankful for.",
          icon: "format-quote-close",
          screen: EXERCISE_TIPS_SCREEN,
          params: { topic: "gratitude", title: "Gratitude Reset" },
        },
      ],
    },
  ],
};

export function getDailyPlanSections(moodId: MoodId): DailyPlanSection[] {
  return DAILY_PLAN_BY_MOOD[moodId] ?? DAILY_PLAN_BY_MOOD.neutral;
}

