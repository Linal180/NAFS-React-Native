import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { 
  FadeInUp, 
  FadeOutDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withSequence 
} from "react-native-reanimated";
import { NAFS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type EncouragingMessageProps = {
  message: string;
  isVisible: boolean;
  onHide: () => void;
};

const MESSAGES = [
  "You're doing great! 🌟",
  "Small steps lead to big changes. 💪",
  "Be proud of yourself for taking this time. ❤️",
  "You've got this! ✨",
  "One moment at a time. 🧘",
];

export function EncouragingMessage({ message, isVisible, onHide }: EncouragingMessageProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1),
        withDelay(3000, withSpring(0))
      );
      const timer = setTimeout(() => {
        onHide();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutDown} 
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="star-circle" size={32} color={NAFS.blue} />
        <Text style={styles.text}>{message || MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: "center",
  },
  content: {
    backgroundColor: NAFS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: NAFS.blue + "20",
  },
  text: {
    fontSize: 16,
    fontWeight: "800",
    color: NAFS.navy,
  },
});
