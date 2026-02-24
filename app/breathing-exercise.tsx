import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';

type Pattern = {
  name: string;
  phases: { label: string; duration: number }[];
  totalCycles: number;
};

const PATTERNS: Pattern[] = [
  {
    name: '4-7-8 Breathing',
    phases: [
      { label: 'Inhale', duration: 4000 },
      { label: 'Hold', duration: 7000 },
      { label: 'Exhale', duration: 8000 },
    ],
    totalCycles: 5,
  },
  {
    name: 'Box Breathing',
    phases: [
      { label: 'Inhale', duration: 4000 },
      { label: 'Hold', duration: 4000 },
      { label: 'Exhale', duration: 4000 },
      { label: 'Hold', duration: 4000 },
    ],
    totalCycles: 5,
  },
];

export default function BreathingExerciseScreen() {
  const router = useRouter();
  const [patternIndex, setPatternIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [phase, setPhase] = useState('Ready');
  const [cycle, setCycle] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const isRunningRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pattern = PATTERNS[patternIndex];

  const stopAnimation = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    setPhase('Ready');
    setCycle(0);
    scaleAnim.stopAnimation();
    Animated.timing(scaleAnim, {
      toValue: 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const runPhase = (
    phases: Pattern['phases'],
    phaseIdx: number,
    currentCycle: number,
    totalCycles: number,
  ) => {
    if (!isRunningRef.current) return;

    if (currentCycle >= totalCycles) {
      isRunningRef.current = false;
      setIsRunning(false);
      setIsCompleted(true);
      setPhase('Done');
      scaleAnim.stopAnimation();
      Animated.timing(scaleAnim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (phaseIdx >= phases.length) {
      runPhase(phases, 0, currentCycle + 1, totalCycles);
      return;
    }

    const p = phases[phaseIdx];
    setPhase(p.label);
    setCycle(currentCycle + 1);

    if (p.label === 'Hold') {
      timeoutRef.current = setTimeout(() => {
        runPhase(phases, phaseIdx + 1, currentCycle, totalCycles);
      }, p.duration);
    } else {
      const toValue = p.label === 'Inhale' ? 1.2 : 0.6;
      Animated.timing(scaleAnim, {
        toValue,
        duration: p.duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isRunningRef.current) {
          runPhase(phases, phaseIdx + 1, currentCycle, totalCycles);
        }
      });
    }
  };

  const startExercise = () => {
    isRunningRef.current = true;
    setIsRunning(true);
    setIsCompleted(false);
    scaleAnim.setValue(0.6);
    runPhase(pattern.phases, 0, 0, pattern.totalCycles);
  };

  const restart = () => {
    stopAnimation();
    setIsCompleted(false);
  };

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      scaleAnim.stopAnimation();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Breathing Exercise</Text>

        <View style={styles.chips}>
          {PATTERNS.map((p, i) => (
            <TouchableOpacity
              key={p.name}
              style={[styles.chip, patternIndex === i && styles.chipActive]}
              onPress={() => {
                if (!isRunning) {
                  setPatternIndex(i);
                  setIsCompleted(false);
                  setPhase('Ready');
                  setCycle(0);
                }
              }}
              disabled={isRunning || isCompleted}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, patternIndex === i && styles.chipTextActive]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.phaseText}>{phase}</Text>
          </Animated.View>
        </View>

        {isRunning && (
          <Text style={styles.cycleText}>
            Cycle {cycle} of {pattern.totalCycles}
          </Text>
        )}
        {isCompleted && (
          <Text style={styles.cycleText}>Complete</Text>
        )}

        <View style={styles.buttons}>
          {isCompleted ? (
            <>
              <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
                <Text style={styles.startButtonText}>Back to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.restartButton} onPress={restart} activeOpacity={0.85}>
                <Text style={styles.restartButtonText}>Restart</Text>
              </TouchableOpacity>
            </>
          ) : !isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startExercise} activeOpacity={0.85}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopAnimation} activeOpacity={0.85}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
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
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.navy,
    marginBottom: 20,
  },
  chips: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: NAFS.white,
    borderWidth: 1.5,
    borderColor: NAFS.greyLight,
  },
  chipActive: {
    backgroundColor: NAFS.blue,
    borderColor: NAFS.blue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: NAFS.grey,
  },
  chipTextActive: {
    color: NAFS.white,
  },
  circleContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: NAFS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  phaseText: {
    fontSize: 22,
    fontWeight: '700',
    color: NAFS.white,
    letterSpacing: 1,
  },
  cycleText: {
    fontSize: 16,
    fontWeight: '600',
    color: NAFS.grey,
    marginBottom: 30,
  },
  buttons: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stopButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: NAFS.error,
  },
  stopButtonText: {
    color: NAFS.error,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  restartButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: NAFS.greyLight,
    marginTop: 12,
  },
  restartButtonText: {
    color: NAFS.grey,
    fontSize: 16,
    fontWeight: '600',
  },
});
