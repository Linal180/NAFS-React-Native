import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NAFS } from "@/constants/theme";
import { getExerciseById, type ExerciseDefinition, type ExerciseStep } from "@/constants/exercises";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, totalSeconds % 60);
  return `${m}:${pad2(s)}`;
}

function getTotalSeconds(steps: ExerciseStep[]) {
  return steps.reduce((sum, s) => sum + (s.seconds ?? 0), 0);
}

export default function ExercisePlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const exercise = useMemo(() => getExerciseById(id), [id]);
  const steps = exercise?.steps ?? [];
  const totalSeconds = useMemo(() => getTotalSeconds(steps), [steps]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [exerciseRemaining, setExerciseRemaining] = useState(totalSeconds);
  const [stepRemaining, setStepRemaining] = useState<number | null>(steps[0]?.seconds ?? null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = steps[stepIndex];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(
    (targetExercise?: ExerciseDefinition) => {
      clearTimer();
      const s = targetExercise?.steps ?? steps;
      setIsRunning(false);
      setIsCompleted(false);
      setStepIndex(0);
      const total = getTotalSeconds(s);
      setExerciseRemaining(total);
      setStepRemaining(s[0]?.seconds ?? null);
    },
    [clearTimer, steps],
  );

  const advanceStep = useCallback(() => {
    setStepIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= steps.length) {
        clearTimer();
        setIsRunning(false);
        setIsCompleted(true);
        setStepRemaining(0);
        setExerciseRemaining(0);
        return prev;
      }

      const next = steps[nextIdx];
      setStepRemaining(next.seconds ?? null);
      return nextIdx;
    });
  }, [clearTimer, steps]);

  const tick = useCallback(() => {
    setExerciseRemaining((prev) => Math.max(0, prev - 1));
    setStepRemaining((prev) => {
      if (prev == null) return prev;
      const next = Math.max(0, prev - 1);
      if (next === 0) {
        // Give state a moment to settle; then advance.
        setTimeout(() => advanceStep(), 0);
      }
      return next;
    });
  }, [advanceStep]);

  const start = useCallback(() => {
    if (!exercise || steps.length === 0) return;
    if (isCompleted) return;
    if (isRunning) return;
    setIsRunning(true);
    clearTimer();
    intervalRef.current = setInterval(tick, 1000);
  }, [clearTimer, exercise, isCompleted, isRunning, steps.length, tick]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const next = useCallback(() => {
    if (!exercise || steps.length === 0) return;
    if (isCompleted) return;
    advanceStep();
  }, [advanceStep, exercise, isCompleted, steps.length]);

  const prev = useCallback(() => {
    if (!exercise || steps.length === 0) return;
    if (isCompleted) return;
    setStepIndex((idx) => {
      const nextIdx = Math.max(0, idx - 1);
      const s = steps[nextIdx];
      setStepRemaining(s.seconds ?? null);
      return nextIdx;
    });
  }, [exercise, isCompleted, steps]);

  useEffect(() => {
    reset(exercise);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>Exercise</Text>
          <Text style={styles.subtitle}>This exercise couldn’t be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const Icon = exercise.icon;
  const Illustration = exercise.Illustration;
  const stepCount = steps.length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, { backgroundColor: exercise.color + "12" }]}>
            <Icon size={22} color={exercise.color} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.subtitle}>{exercise.subtitle}</Text>
          </View>
        </View>

        <View style={styles.illustrationWrap}>
          <Illustration size={190} color={exercise.color} />
        </View>

        {isCompleted ? (
          <View style={styles.completedWrap}>
            <Text style={styles.completedText}>Exercise Completed ✅</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: exercise.color }]}
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={() => reset(exercise)}>
              <Text style={styles.secondaryButtonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.timerRow}>
              <View style={styles.timerPill}>
                <Text style={styles.timerLabel}>Exercise</Text>
                <Text style={styles.timerValue}>{formatTime(exerciseRemaining)}</Text>
              </View>
              <View style={[styles.timerPill, { borderColor: exercise.color + "35" }]}>
                <Text style={styles.timerLabel}>Step</Text>
                <Text style={[styles.timerValue, { color: exercise.color }]}>
                  {stepRemaining == null ? "—" : formatTime(stepRemaining)}
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepKicker}>
                  Step {Math.min(stepIndex + 1, stepCount)} of {stepCount}
                </Text>
                <View style={styles.dots}>
                  {steps.map((_, i) => (
                    <View
                      key={`${exercise.id}-dot-${i}`}
                      style={[
                        styles.dot,
                        i === stepIndex && { backgroundColor: exercise.color, borderColor: exercise.color },
                        i < stepIndex && { backgroundColor: exercise.color + "55", borderColor: exercise.color + "55" },
                      ]}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.stepTitle}>{currentStep?.title ?? "Ready"}</Text>
              <Text style={styles.stepDescription}>{currentStep?.description ?? "Press Start to begin."}</Text>
            </View>

            <View style={styles.controls}>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={[styles.navButton, stepIndex === 0 && styles.navButtonDisabled]}
                  onPress={prev}
                  disabled={stepIndex === 0}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.navButtonText, stepIndex === 0 && styles.navButtonTextDisabled]}>Prev</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: exercise.color }]}
                  activeOpacity={0.85}
                  onPress={isRunning ? pause : start}
                >
                  <Text style={styles.primaryButtonText}>{isRunning ? "Pause" : "Start Exercise"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navButton, stepIndex >= stepCount - 1 && styles.navButtonDisabled]}
                  onPress={next}
                  disabled={stepIndex >= stepCount - 1}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.navButtonText,
                      stepIndex >= stepCount - 1 && styles.navButtonTextDisabled,
                    ]}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={() => reset(exercise)}>
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: NAFS.navy,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: NAFS.grey,
    lineHeight: 18,
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 14,
    marginTop: 8,
  },
  timerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  timerPill: {
    flex: 1,
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: NAFS.grey,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  timerValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "900",
    color: NAFS.navy,
  },
  stepCard: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  stepKicker: {
    fontSize: 12,
    fontWeight: "900",
    color: NAFS.grey,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: NAFS.greyLight,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NAFS.navy,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: NAFS.navy,
    lineHeight: 20,
  },
  controls: {
    marginTop: "auto",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navButton: {
    width: 70,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAFS.white,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: NAFS.navy,
  },
  navButtonTextDisabled: {
    color: NAFS.grey,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  primaryButtonText: {
    color: NAFS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAFS.white,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: NAFS.grey,
  },
  completedWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 10,
  },
  completedText: {
    fontSize: 22,
    fontWeight: "900",
    color: NAFS.navy,
    textAlign: "center",
    marginBottom: 8,
  },
});

