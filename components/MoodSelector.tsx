import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NAFS } from "@/constants/theme";
import { getMoodMeta, type MoodId, MOODS } from "@/constants/moods";
import * as Haptics from "expo-haptics";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";

type MoodSelectorProps = {
  selectedMoodId: MoodId | null;
  onSelect: (moodId: MoodId) => void;
  title?: string;
};

function MoodChip({ mood, isSelected, onSelect }: { 
  mood: typeof MOODS[0]; 
  isSelected: boolean; 
  onSelect: (moodId: MoodId) => void;
}) {
  const scale = useSharedValue(isSelected ? 1.05 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(isSelected ? 1.05 : 1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(mood.id);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${mood.label} mood`}
    >
      <Animated.View
        style={[
          styles.chip,
          {
            borderColor: isSelected ? mood.color : NAFS.greyLight,
            backgroundColor: isSelected ? `${mood.color}14` : NAFS.white,
          },
          animatedStyle,
        ]}
      >
        <Text style={styles.emoji}>{mood.emoji}</Text>
        <Text style={[styles.label, { color: isSelected ? mood.color : NAFS.navy }]}>
          {mood.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function MoodSelector({ selectedMoodId, onSelect, title }: MoodSelectorProps) {
  const selectedMood = useMemo(() => {
    if (!selectedMoodId) return null;
    try {
      return getMoodMeta(selectedMoodId);
    } catch {
      return null;
    }
  }, [selectedMoodId]);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>How are you feeling?</Text>
      <Text style={styles.title}>{title || "Check in with yourself"}</Text>

      <View style={styles.chipsRow}>
        {MOODS.map((mood) => (
          <MoodChip
            key={mood.id}
            mood={mood}
            isSelected={selectedMood?.id === mood.id}
            onSelect={onSelect}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: NAFS.grey,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: NAFS.navy,
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
});

