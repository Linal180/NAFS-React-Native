import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';
import { BreathingIcon, JournalIcon, MeditationIcon, ExerciseIcon, GratitudeIcon, MusicIcon } from '@/components/ui/app-icons';
import type { ComponentType } from 'react';

type Exercise = {
  icon: ComponentType<{ size: number; color: string }>;
  title: string;
  duration: string;
  color: string;
  route: string;
  routeParams?: Record<string, string>;
};

const EXERCISES: Exercise[] = [
  { icon: BreathingIcon, title: 'Deep\nBreathing', duration: '5 min', color: '#26A69A', route: '/breathing-exercise' },
  { icon: JournalIcon, title: 'Positive\nJournaling', duration: '10 min', color: '#5C6BC0', route: '/exercise-tips', routeParams: { topic: 'journaling', title: 'Positive Journaling' } },
  { icon: MeditationIcon, title: 'Mindful\nMeditation', duration: '15 min', color: '#AB47BC', route: '/meditation' },
  { icon: ExerciseIcon, title: 'Stress Relief\nExercise', duration: '10 min', color: '#EF5350', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Stress Relief' } },
  { icon: GratitudeIcon, title: 'Gratitude\nPractice', duration: '5 min', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Gratitude Practice' } },
  { icon: MusicIcon, title: 'Relaxation\nSounds', duration: '20 min', color: '#42A5F5', route: '/exercise-tips', routeParams: { topic: 'relaxation', title: 'Relaxation Sounds' } },
];

export default function ExercisesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Smart Exercises</Text>
        <Text style={styles.subtitle}>Recommended for your mood</Text>

        <View style={styles.grid}>
          {EXERCISES.map((exercise, index) => {
            const IconComponent = exercise.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.exerciseCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: exercise.route as any,
                    params: exercise.routeParams,
                  })
                }
              >
                <View style={[styles.iconContainer, { backgroundColor: exercise.color + '12' }]}>
                  <IconComponent size={30} color={exercise.color} />
                </View>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <View style={[styles.durationBadge, { backgroundColor: exercise.color + '15' }]}>
                  <Text style={[styles.exerciseDuration, { color: exercise.color }]}>{exercise.duration}</Text>
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
    fontWeight: '500',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.navy,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: NAFS.grey,
    textAlign: 'center',
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  exerciseCard: {
    width: '47%',
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: NAFS.navy,
    textAlign: 'center',
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
    fontWeight: '600',
  },
});
