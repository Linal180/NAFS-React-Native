import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';

const TIPS: Record<string, string[]> = {
  journaling: [
    'Write about a moment today that made you smile, no matter how small.',
    'Describe a challenge you overcame recently and what you learned from it.',
    'List 5 things about yourself that you are proud of.',
    'Write a letter to your future self with encouragement and hope.',
    'Reflect on a person who positively impacted your life and why.',
  ],
  'stress-relief': [
    'Try progressive muscle relaxation: tense each muscle group for 5 seconds, then release.',
    'Do 10 slow neck rolls, 5 in each direction, to release shoulder tension.',
    'Take a 10-minute walk outside and focus on the sensation of each step.',
    'Shake out your hands and arms vigorously for 30 seconds to release nervous energy.',
    'Do 5 gentle forward folds, letting your head hang heavy to decompress your spine.',
  ],
  gratitude: [
    'Name 3 people you are grateful to have in your life and why.',
    'Think of a difficult experience that taught you something valuable.',
    'Appreciate your body: write down 3 things it allows you to do every day.',
    'Recall a kind act someone did for you recently and how it made you feel.',
    'Look around your space and find 3 objects you are thankful to own.',
  ],
  relaxation: [
    'Create a cozy corner with soft lighting and spend 10 minutes in silence.',
    'Listen to nature sounds or calming instrumental music for 15 minutes.',
    'Try a warm cup of herbal tea while focusing only on the taste and warmth.',
    'Practice gentle stretching with slow, deep breaths for 10 minutes.',
    'Visualize your favorite peaceful place in vivid detail for 5 minutes.',
  ],
};

export default function ExerciseTipsScreen() {
  const router = useRouter();
  const { topic, title } = useLocalSearchParams<{ topic?: string; title?: string }>();

  const tips = TIPS[topic || 'journaling'] || TIPS.journaling;
  const screenTitle = title || 'Tips';

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{screenTitle}</Text>
        <Text style={styles.subtitle}>Try these exercises to feel better</Text>

        <View style={styles.tipsList}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/chatbot')}
        >
          <Text style={styles.chatButtonText}>Chat with NAFSE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lightBg,
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
  tipsList: {
    gap: 14,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: NAFS.white,
    borderRadius: 16,
    padding: 18,
    alignItems: 'flex-start',
    gap: 14,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: NAFS.blue + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: NAFS.blue,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: NAFS.navy,
    lineHeight: 21,
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
