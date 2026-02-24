import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';
import { SunriseIcon, TargetIcon, QuoteIcon, BreathingIcon, MeditationIcon } from '@/components/ui/app-icons';
import type { ComponentType } from 'react';

type PlanItem = {
  icon: ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle: string;
  color: string;
  route: string;
  routeParams?: Record<string, string>;
};

const MOOD_PLANS: Record<string, PlanItem[]> = {
  Sad: [
    { icon: SunriseIcon, title: 'Gentle Morning', subtitle: 'Start slowly — stretch, hydrate, and breathe', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Gentle Morning' } },
    { icon: QuoteIcon, title: 'Uplifting Quotes', subtitle: 'Read quotes to remind you of your strength', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Uplifting Quotes' } },
    { icon: BreathingIcon, title: 'Calming Breaths', subtitle: '5 minutes of deep breathing to ease tension', color: '#26A69A', route: '/breathing-exercise' },
    { icon: MeditationIcon, title: 'Guided Meditation', subtitle: 'A short meditation focused on self-compassion', color: '#5C6BC0', route: '/meditation' },
    { icon: TargetIcon, title: 'One Small Goal', subtitle: 'Pick just one achievable thing for today', color: NAFS.blue, route: '/exercises' },
  ],
  Happy: [
    { icon: SunriseIcon, title: 'Energized Morning', subtitle: 'Channel your good energy into a productive start', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Energized Morning' } },
    { icon: TargetIcon, title: 'Set Bold Goals', subtitle: 'Ride the momentum — aim higher today', color: NAFS.blue, route: '/exercises' },
    { icon: QuoteIcon, title: 'Gratitude Journal', subtitle: 'Write down 3 things you\'re grateful for', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Gratitude Journal' } },
    { icon: BreathingIcon, title: 'Energizing Breathwork', subtitle: 'Box breathing to maintain your positive state', color: '#26A69A', route: '/breathing-exercise' },
    { icon: MeditationIcon, title: 'Mindful Reflection', subtitle: 'Savor this feeling through mindful awareness', color: '#5C6BC0', route: '/meditation' },
  ],
  Anxious: [
    { icon: BreathingIcon, title: 'Grounding Breaths', subtitle: '4-7-8 breathing to calm your nervous system', color: '#26A69A', route: '/breathing-exercise' },
    { icon: MeditationIcon, title: 'Body Scan', subtitle: 'Release tension from head to toe', color: '#5C6BC0', route: '/meditation' },
    { icon: SunriseIcon, title: 'Slow Start', subtitle: 'No rush — take your morning one step at a time', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Slow Start' } },
    { icon: QuoteIcon, title: 'Calming Affirmations', subtitle: 'Repeat: "I am safe. This will pass."', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Calming Affirmations' } },
    { icon: TargetIcon, title: 'Tiny Wins', subtitle: 'Focus on small, manageable tasks only', color: NAFS.blue, route: '/exercises' },
  ],
  Angry: [
    { icon: BreathingIcon, title: 'Cool-Down Breathing', subtitle: 'Slow exhales to release built-up tension', color: '#26A69A', route: '/breathing-exercise' },
    { icon: MeditationIcon, title: 'Letting Go Meditation', subtitle: 'Visualize releasing what\'s bothering you', color: '#5C6BC0', route: '/meditation' },
    { icon: SunriseIcon, title: 'Physical Release', subtitle: 'A short walk or stretch to move the energy', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Physical Release' } },
    { icon: QuoteIcon, title: 'Perspective Quotes', subtitle: 'Wisdom to help shift your viewpoint', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Perspective Quotes' } },
    { icon: TargetIcon, title: 'Constructive Focus', subtitle: 'Channel energy into something productive', color: NAFS.blue, route: '/exercises' },
  ],
  Calm: [
    { icon: SunriseIcon, title: 'Peaceful Morning', subtitle: 'Maintain your calm with a gentle routine', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'relaxation', title: 'Peaceful Morning' } },
    { icon: TargetIcon, title: 'Focused Goals', subtitle: 'Use your clarity to plan effectively', color: NAFS.blue, route: '/exercises' },
    { icon: QuoteIcon, title: 'Reflective Reading', subtitle: 'Deepen your peace with mindful reading', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Reflective Reading' } },
    { icon: MeditationIcon, title: 'Deep Meditation', subtitle: 'Go deeper — extend your meditation today', color: '#5C6BC0', route: '/meditation' },
    { icon: BreathingIcon, title: 'Balanced Breathing', subtitle: 'Alternate nostril breathing for harmony', color: '#26A69A', route: '/breathing-exercise' },
  ],
};

const DEFAULT_PLAN: PlanItem[] = [
  { icon: SunriseIcon, title: 'Morning', subtitle: 'Wake up and start your day mindfully', color: '#FFB74D', route: '/exercise-tips', routeParams: { topic: 'stress-relief', title: 'Morning Routine' } },
  { icon: TargetIcon, title: "Today's Goals", subtitle: 'Set focused, achievable goals', color: NAFS.blue, route: '/exercises' },
  { icon: QuoteIcon, title: 'Motivational Quotes', subtitle: 'Read inspiring quotes to uplift you', color: '#AB47BC', route: '/exercise-tips', routeParams: { topic: 'gratitude', title: 'Motivational Quotes' } },
  { icon: BreathingIcon, title: 'Breathing Exercises', subtitle: 'Practice deep breathing to calm and focus', color: '#26A69A', route: '/breathing-exercise' },
  { icon: MeditationIcon, title: 'Meditation', subtitle: 'Spend time in reflection and prayer', color: '#5C6BC0', route: '/meditation' },
];

export default function DailyPlanScreen() {
  const router = useRouter();
  const { mood, emoji } = useLocalSearchParams<{ mood?: string; emoji?: string }>();

  const currentMood = mood || 'Neutral';
  const currentEmoji = emoji || '🙂';
  const planItems = MOOD_PLANS[currentMood] || DEFAULT_PLAN;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/nafs_logo.png')}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Daily Plan</Text>
          <View style={styles.moodBadge}>
            <Text style={styles.moodBadgeText}>{currentEmoji} Your mood: {currentMood}</Text>
          </View>
        </View>

        <View style={styles.planList}>
          {planItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.planCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: item.route as any,
                    params: item.routeParams,
                  })
                }
              >
                <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                  <IconComponent size={24} color={item.color} />
                </View>
                <View style={styles.planContent}>
                  <Text style={styles.planTitle}>{item.title}</Text>
                  <Text style={styles.planSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.exercisesButton}
          activeOpacity={0.85}
          onPress={() => router.push('/exercises')}
        >
          <Text style={styles.exercisesButtonText}>View Exercises</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.white,
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.navy,
    letterSpacing: 4,
    marginTop: 6,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: NAFS.navy,
    marginBottom: 14,
  },
  moodBadge: {
    backgroundColor: NAFS.lavender,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  moodBadgeText: {
    color: NAFS.navy,
    fontSize: 14,
    fontWeight: '600',
  },
  planList: {
    gap: 12,
  },
  planCard: {
    flexDirection: 'row',
    backgroundColor: NAFS.lightBg,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NAFS.navy,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    color: NAFS.grey,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: NAFS.grey,
    fontWeight: '300',
  },
  exercisesButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  exercisesButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
