import { EncouragingMessage } from "@/components/EncouragingMessage";
import { EXERCISE_DEFINITIONS } from "@/constants/exercises";
import { MoodId } from "@/constants/moods";
import { NAFS } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function estimateMinutes(def: { steps: { seconds?: number }[] }) {
  const totalSeconds = def.steps.reduce((sum, s) => sum + (s.seconds ?? 0), 0);
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} min`;
}

const MOOD_RECOMMENDATIONS: Record<MoodId, string[]> = {
  happy: ["gratitude-practice", "positive-journaling", "mindful-meditation"],
  neutral: ["mindful-meditation", "deep-breathing", "relaxation-sounds"],
  sad: ["positive-journaling", "deep-breathing", "relaxation-sounds"],
  anxious: ["deep-breathing", "mindful-meditation", "relaxation-sounds"],
  angry: ["stress-relief-exercise", "deep-breathing", "mindful-meditation"],
};

export default function ExercisesScreen() {
  const router = useRouter();
  const { mood } = useLocalSearchParams<{ mood: MoodId }>();
  const [showEncouragement, setShowEncouragement] = useState(false);

  const sortedExercises = useMemo(() => {
    if (!mood) return EXERCISE_DEFINITIONS;

    const recommendedIds = MOOD_RECOMMENDATIONS[mood] || [];
    return [...EXERCISE_DEFINITIONS].sort((a, b) => {
      const aIndex = recommendedIds.indexOf(a.id);
      const bIndex = recommendedIds.indexOf(b.id);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }, [mood]);

  const handleExercisePress = (id: string) => {
    setShowEncouragement(true);
    setTimeout(() => {
      router.push({ pathname: "/exercise-player", params: { id } });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <EncouragingMessage 
        isVisible={showEncouragement} 
        onHide={() => setShowEncouragement(false)} 
        message="Great choice! Taking care of yourself is important. ✨"
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Smart Exercises</Text>
        <Text style={styles.subtitle}>
          {mood ? `Personalized for your ${mood} mood` : "Recommended for your mood"}
        </Text>

        <View style={styles.grid}>
          {sortedExercises.map((exercise, index) => {
            const IconComponent = exercise.icon;
            const duration = estimateMinutes(exercise);
            const isRecommended = mood && MOOD_RECOMMENDATIONS[mood]?.includes(exercise.id);

            return (
              <TouchableOpacity
                key={index}
                style={[styles.exerciseCard, isRecommended && styles.recommendedCard]}
                activeOpacity={0.8}
                onPress={() => handleExercisePress(exercise.id)}
              >
                {isRecommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>BEST FOR YOU</Text>
                  </View>
                )}
                <View style={[styles.iconContainer, { backgroundColor: exercise.color + "12" }]}>
                  <IconComponent size={30} color={exercise.color} />
                </View>
                <Text style={styles.exerciseTitle}>
                  {exercise.title.split(" ").join("\n")}
                </Text>
                <View style={[styles.durationBadge, { backgroundColor: exercise.color + "15" }]}>
                  <Text style={[styles.exerciseDuration, { color: exercise.color }]}>{duration}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    color: NAFS.navy,
    fontSize: 16,
    fontWeight: "500",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: NAFS.navy,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: NAFS.grey,
    textAlign: "center",
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
  },
  exerciseCard: {
    width: "47%",
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  recommendedCard: {
    borderColor: NAFS.blue,
    borderWidth: 2,
    shadowOpacity: 0.15,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: NAFS.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  recommendedText: {
    color: NAFS.white,
    fontSize: 8,
    fontWeight: '900',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: NAFS.navy,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  durationBadge: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  exerciseDuration: {
    fontSize: 12,
    fontWeight: "600",
  },
});
