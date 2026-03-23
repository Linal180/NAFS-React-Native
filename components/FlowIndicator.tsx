import { NAFS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export type StepKey = "mood" | "plan" | "exercises" | "chat" | "progress";

type FlowStep = {
  key: StepKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route?: string;
};

const STEPS: FlowStep[] = [
  { key: "mood", label: "Mood", icon: "emoticon-happy-outline" },
  { key: "plan", label: "Plan", icon: "calendar-check-outline", route: "/daily-plan" },
  { key: "exercises", label: "Exercises", icon: "yoga", route: "/exercises" },
  { key: "chat", label: "Chat", icon: "chat-processing-outline", route: "/chatbot" },
  { key: "progress", label: "Progress", icon: "chart-timeline-variant", route: "/progress" },
];

type FlowIndicatorProps = {
  currentStep: StepKey;
  completedSteps: StepKey[];
  onStepPress: (step: FlowStep) => void;
};

function AnimatedStep({ step, isCompleted, isCurrent, isLast, onPress }: { 
  step: FlowStep; 
  isCompleted: boolean; 
  isCurrent: boolean; 
  isLast: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <React.Fragment>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.stepContainer}
      >
        <Animated.View
          style={[
            styles.iconCircle,
            isCompleted && styles.iconCircleCompleted,
            isCurrent && styles.iconCircleCurrent,
            animatedStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={isCompleted ? "check" : step.icon}
            size={18}
            color={isCompleted || isCurrent ? NAFS.white : NAFS.grey}
          />
        </Animated.View>
        <Text
          style={[
            styles.stepLabel,
            isCurrent && styles.stepLabelCurrent,
            isCompleted && styles.stepLabelCompleted,
          ]}
          numberOfLines={1}
        >
          {step.label}
        </Text>
      </Pressable>
      {!isLast && (
        <View
          style={[
            styles.connector,
            isCompleted && styles.connectorCompleted,
          ]}
        />
      )}
    </React.Fragment>
  );
}

export function FlowIndicator({ currentStep, completedSteps, onStepPress }: FlowIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Daily Flow</Text>
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => (
          <AnimatedStep
            key={step.key}
            step={step}
            isCompleted={completedSteps.includes(step.key)}
            isCurrent={currentStep === step.key}
            isLast={index === STEPS.length - 1}
            onPress={() => onStepPress(step)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: NAFS.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 8,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: NAFS.navy,
    marginBottom: 16,
    paddingLeft: 4,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: NAFS.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  iconCircleCurrent: {
    backgroundColor: NAFS.blue,
    borderColor: NAFS.blue,
  },
  iconCircleCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: NAFS.grey,
    textAlign: "center",
  },
  stepLabelCurrent: {
    color: NAFS.blue,
  },
  stepLabelCompleted: {
    color: "#4CAF50",
  },
  connector: {
    height: 2,
    flex: 0.5,
    backgroundColor: NAFS.greyLight,
    marginTop: -20, // Align with center of circles
  },
  connectorCompleted: {
    backgroundColor: "#4CAF50",
  },
});
