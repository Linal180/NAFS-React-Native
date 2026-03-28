import { BotIcon } from '@/components/ui/app-icons';
import { getExerciseById } from '@/constants/exercises';
import { MoodId, getMoodMeta } from '@/constants/moods';
import { NAFS } from '@/constants/theme';
import { sendChatMessage } from '@/lib/gemini';
import { loadLocalMoodState } from '@/lib/local-mood-history';
import type { Content } from '@google/generative-ai';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  recommendedExerciseId?: string;
};

const SUGGESTIONS_BY_MOOD: Record<MoodId, string[]> = {
  happy: ['Keep the momentum', 'Gratitude ideas', 'Productivity tips', 'Share joy'],
  neutral: ['Morning routine', 'Mindful walk', 'Small goals', 'Relaxation'],
  sad: ['Self-care tips', 'Gentle movement', 'Motivation', 'I feel down'],
  anxious: ['Breathing tips', 'Stop overthinking', 'Grounding', 'Quick calm'],
  angry: ['Release tension', 'Cool down', 'Safe outlet', 'Patience'],
};

const DEFAULT_SUGGESTIONS = [
  'How to relax?',
  'Breathing tips',
  'Motivate me',
  'I feel stressed',
  "I can't sleep",
];

function detectRecommendedExerciseId(text: string): string | undefined {
  const lower = text.toLowerCase();

  if (lower.includes("can't sleep") || lower.includes('cant sleep') || lower.includes('insomnia') || lower.includes('sleep')) {
    return 'relaxation-sounds';
  }

  if (lower.includes('stressed') || lower.includes('stress') || lower.includes('overwhelmed') || lower.includes('anxious')) {
    return 'deep-breathing';
  }

  if (lower.includes('relax')) {
    return 'relaxation-sounds';
  }

  if (lower.includes('breathe') || lower.includes('breathing') || lower.includes('breath')) {
    return 'deep-breathing';
  }

  if (lower.includes('motivate') || lower.includes('unmotivated') || lower.includes('no motivation')) {
    return 'gratitude-practice';
  }

  return undefined;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodId | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const historyRef = useRef<Content[]>([]);

  useEffect(() => {
    async function init() {
      const { selectedMoodId } = await loadLocalMoodState();
      setCurrentMood(selectedMoodId);
      
      const moodMeta = selectedMoodId ? getMoodMeta(selectedMoodId) : null;
      const initialText = moodMeta 
        ? `Hi there! I see you're feeling ${moodMeta.label} today ${moodMeta.emoji}. I'm here to support you. What's on your mind?`
        : "Hi there! I'm your NAFS wellness assistant. How are you feeling today?";
        
      setMessages([{ id: '1', text: initialText, isUser: false }]);
      
      if (selectedMoodId) {
        historyRef.current = [
          { role: 'user', parts: [{ text: `I am feeling ${selectedMoodId} today.` }] },
          { role: 'model', parts: [{ text: initialText }] },
        ];
      }
    }
    init();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), text: text.trim(), isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const recommendedId = detectRecommendedExerciseId(text);

    try {
      const moodContext = currentMood ? `[Context: User's current mood is ${currentMood}] ` : '';
      const reply = await sendChatMessage(historyRef.current, moodContext + text.trim());
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [{ text: text.trim() }] },
        { role: 'model', parts: [{ text: reply }] },
      ];
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      const botMessages: Message[] = [botMsg];

      if (recommendedId && getExerciseById(recommendedId)) {
        const recommendationMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Based on how you\'re feeling, I have a quick exercise you can try.',
          isUser: false,
          recommendedExerciseId: recommendedId,
        };
        botMessages.push(recommendationMessage);
      }

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (e) {
      console.error('Chat error:', e);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I couldn\'t respond right now. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentMood]);

  const suggestions = currentMood ? SUGGESTIONS_BY_MOOD[currentMood] : DEFAULT_SUGGESTIONS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerBot}>
            <View style={styles.headerBotIcon}>
              <BotIcon size={22} color={NAFS.blue} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Chatbot</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.isUser && styles.messageRowUser]}>
              {!item.isUser && (
                <View style={styles.botAvatar}>
                  <BotIcon size={16} color={NAFS.blue} />
                </View>
              )}
              <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
                  {item.text}
                </Text>
                {!item.isUser && item.recommendedExerciseId && (
                  (() => {
                    const exercise = getExerciseById(item.recommendedExerciseId);
                    if (!exercise) return null;
                    const IconComponent = exercise.icon;
                    return (
                      <View style={styles.recommendationCard}>
                        <View style={[styles.recommendationIconContainer, { backgroundColor: exercise.color + '12' }]}>
                          <IconComponent size={22} color={exercise.color} />
                        </View>
                        <View style={styles.recommendationTextContainer}>
                          <Text style={styles.recommendationTitle}>{exercise.title}</Text>
                          <Text style={styles.recommendationSubtitle}>{exercise.subtitle}</Text>
                          <TouchableOpacity
                            style={[styles.recommendationButton, { backgroundColor: exercise.color }]}
                            activeOpacity={0.85}
                            onPress={() =>
                              router.push({
                                pathname: '/exercise-player',
                                params: { id: exercise.id },
                              })
                            }
                          >
                            <Text style={styles.recommendationButtonText}>Start this exercise</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })()
                )}
              </View>
            </View>
          )}
          ListFooterComponent={
            isLoading ? (
              <View style={[styles.messageRow]}>
                <View style={styles.botAvatar}>
                  <BotIcon size={16} color={NAFS.blue} />
                </View>
                <View style={[styles.messageBubble, styles.botBubble]}>
                  <ActivityIndicator size="small" color={NAFS.blue} />
                </View>
              </View>
            ) : null
          }
        />

        {messages.length <= 1 && (
          <View style={styles.suggestionsRow}>
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                activeOpacity={0.7}
                onPress={() => sendMessage(s)}
                disabled={isLoading}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={NAFS.grey}
            value={input}
            onChangeText={setInput}
            editable={!isLoading}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
            activeOpacity={0.85}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: NAFS.greyLight,
  },
  headerBot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NAFS.blue + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NAFS.navy,
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: NAFS.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: NAFS.blue,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: NAFS.lightBg,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: NAFS.white,
  },
  botText: {
    color: NAFS.navy,
  },
  suggestionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: NAFS.lightBg,
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: NAFS.lavender,
  },
  suggestionText: {
    fontSize: 12,
    color: NAFS.blue,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: NAFS.greyLight,
    backgroundColor: NAFS.white,
  },
  input: {
    flex: 1,
    backgroundColor: NAFS.lightBg,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: NAFS.navy,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: NAFS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: NAFS.white,
    fontSize: 20,
  },
  recommendationCard: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  recommendationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationTextContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAFS.navy,
    marginBottom: 2,
  },
  recommendationSubtitle: {
    fontSize: 12,
    color: NAFS.grey,
    marginBottom: 8,
  },
  recommendationButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  recommendationButtonText: {
    color: NAFS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
