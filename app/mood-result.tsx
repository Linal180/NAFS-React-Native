import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';
import { getMoodMeta, normalizeMoodId } from '@/constants/moods';
import { useAuth } from '@/contexts/auth-context';
import { saveMood } from '@/lib/mood-storage';
import { loadLocalMoodState, persistMoodHistory, persistSelectedMood } from '@/lib/local-mood-history';

const MOODS = [
  { label: 'Happy', emoji: '😊', description: "You're radiating positivity! Let's keep the good vibes going." },
  { label: 'Calm', emoji: '😌', description: 'A peaceful state of mind. Let\'s nurture this tranquility.' },
  { label: 'Neutral', emoji: '😐', description: 'Feeling balanced. Let\'s find something to brighten your day.' },
  { label: 'Surprised', emoji: '😲', description: 'Something unexpected happened! Let\'s process this together.' },
  { label: 'Tired', emoji: '😴', description: 'Rest is important. Let\'s find gentle ways to recharge.' },
  { label: 'Sad', emoji: '😔', description: "It's okay to feel this way. Let us help you feel better." },
  { label: 'Anxious', emoji: '😰', description: 'Feeling on edge. Let\'s work on calming your mind.' },
  { label: 'Angry', emoji: '😠', description: 'Your feelings are valid. Let\'s find healthy outlets.' },
];

export default function MoodResultScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { imageUrl, mood, emoji, confidence, description } = useLocalSearchParams<{
    imageUrl?: string;
    mood?: string;
    emoji?: string;
    confidence?: string;
    description?: string;
  }>();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState(mood || 'Sad');
  const [selectedEmoji, setSelectedEmoji] = useState(emoji || '😔');
  const [selectedDescription, setSelectedDescription] = useState(
    description || "It's okay to feel this way. Let us help you feel better.",
  );
  const [selectedConfidence, setSelectedConfidence] = useState(
    confidence ? parseInt(confidence, 10) : 85,
  );
  const [saving, setSaving] = useState(false);

  const pickMood = (m: (typeof MOODS)[number]) => {
    setSelectedMood(m.label);
    setSelectedEmoji(m.emoji);
    setSelectedDescription(m.description);
    setSelectedConfidence(100);
    setShowPicker(false);
  };

  const confirmAndContinue = async () => {
    setSaving(true);
    const moodId = normalizeMoodId(selectedMood);
    const meta = getMoodMeta(moodId);

    try {
      if (user) {
        await saveMood(user.uid, {
          mood: selectedMood,
          emoji: selectedEmoji,
          confidence: selectedConfidence,
          description: selectedDescription,
        });
      }

      // Keep Home's mood history in sync (local, last 5).
      const local = await loadLocalMoodState();
      const next = [
        {
          id: `${Date.now()}-${moodId}-${Math.random().toString(36).slice(2, 6)}`,
          moodId,
          timestamp: new Date().toISOString(),
        },
        ...local.moodHistory,
      ].slice(0, 5);

      await persistSelectedMood(moodId);
      await persistMoodHistory(next);
    } catch (e) {
      console.error('Failed to save mood:', e);
    }

    router.push({
      pathname: '/daily-plan',
      params: { mood: moodId, emoji: meta.emoji },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{showPicker ? 'CHOOSE YOUR MOOD' : 'MOOD DETECTED'}</Text>

        {showPicker ? (
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>How are you really feeling?</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.label}
                  style={[
                    styles.moodOption,
                    selectedMood === m.label && styles.moodOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => pickMood(m)}
                >
                  <Text style={styles.moodOptionEmoji}>{m.emoji}</Text>
                  <Text
                    style={[
                      styles.moodOptionLabel,
                      selectedMood === m.label && styles.moodOptionLabelSelected,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.resultCard}>
            {imageUrl ? (
              <View style={styles.photoCircle}>
                <Image source={{ uri: imageUrl }} style={styles.photo} />
              </View>
            ) : (
              <View style={styles.emojiCircle}>
                <Text style={styles.moodEmoji}>{selectedEmoji}</Text>
              </View>
            )}
            <Text style={styles.moodEmojiSmall}>{selectedEmoji}</Text>
            <Text style={styles.moodLabel}>You seem {selectedMood} today</Text>
            <Text style={styles.moodDescription}>{selectedDescription}</Text>
            <View style={styles.confidenceWrap}>
              <Text style={styles.confidenceLabel}>Confidence</Text>
              <View style={styles.confidenceBar}>
                <View style={[styles.confidenceFill, { width: `${selectedConfidence}%` }]} />
              </View>
              <Text style={styles.confidenceValue}>{selectedConfidence}%</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmButton, saving && styles.buttonDisabled]}
          activeOpacity={0.85}
          onPress={confirmAndContinue}
          disabled={saving || showPicker}
        >
          {saving ? (
            <ActivityIndicator color={NAFS.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Yes, that&apos;s right</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.correctButton}
          activeOpacity={0.85}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={styles.correctButtonText}>
            {showPicker ? 'Cancel' : 'No, let me choose'}
          </Text>
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
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
    color: NAFS.grey,
    marginBottom: 28,
    letterSpacing: 2,
  },
  resultCard: {
    backgroundColor: NAFS.white,
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    width: '100%',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 36,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NAFS.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  moodEmoji: {
    fontSize: 56,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: NAFS.lavender,
    marginBottom: 12,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  moodEmojiSmall: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.navy,
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 14,
    color: NAFS.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  confidenceWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confidenceLabel: {
    fontSize: 13,
    color: NAFS.grey,
    fontWeight: '500',
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: NAFS.greyLight,
    borderRadius: 4,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: NAFS.blue,
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: NAFS.blue,
  },
  pickerCard: {
    backgroundColor: NAFS.white,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 36,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NAFS.navy,
    textAlign: 'center',
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: NAFS.lightBg,
  },
  moodOptionSelected: {
    backgroundColor: NAFS.blue + '15',
    borderWidth: 1.5,
    borderColor: NAFS.blue,
  },
  moodOptionEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  moodOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: NAFS.grey,
  },
  moodOptionLabelSelected: {
    color: NAFS.blue,
  },
  confirmButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 16,
    paddingVertical: 17,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  correctButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 17,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: NAFS.blue,
  },
  correctButtonText: {
    color: NAFS.blue,
    fontSize: 16,
    fontWeight: '600',
  },
});
