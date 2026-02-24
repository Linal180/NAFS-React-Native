import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { NAFS } from '@/constants/theme';

const DURATIONS = [5, 10, 15];

const PHASES = [
  { threshold: 1.0, text: 'Close your eyes and relax...' },
  { threshold: 0.75, text: 'Focus on your breathing...' },
  { threshold: 0.5, text: 'Notice your thoughts without judgment...' },
  { threshold: 0.25, text: 'Gently bring your focus back...' },
];

function getPhaseText(progress: number): string {
  for (const phase of PHASES) {
    if (progress >= phase.threshold) return phase.text;
  }
  return PHASES[PHASES.length - 1].text;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const RING_SIZE = 220;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MeditationScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;
  const progress = remaining / totalSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearTimer();
    setIsRunning(false);
  };

  const reset = () => {
    clearTimer();
    setIsRunning(false);
    setRemaining(duration * 60);
  };

  const selectDuration = (mins: number) => {
    if (isRunning) return;
    setDuration(mins);
    setRemaining(mins * 60);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const phaseText = remaining === totalSeconds && !isRunning
    ? 'Press Start to begin'
    : remaining === 0
      ? 'Session complete'
      : getPhaseText(progress);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Guided Meditation</Text>

        <View style={styles.chips}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, duration === d && styles.chipActive]}
              onPress={() => selectDuration(d)}
              disabled={isRunning}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
                {d} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={NAFS.greyLight}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={NAFS.blue}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.timerText}>{formatTime(remaining)}</Text>
          </View>
        </View>

        <Text style={styles.phaseText}>{phaseText}</Text>

        <View style={styles.buttons}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.startButton, remaining === 0 && styles.buttonDisabled]}
              onPress={start}
              activeOpacity={0.85}
              disabled={remaining === 0}
            >
              <Text style={styles.startButtonText}>{remaining < totalSeconds && remaining > 0 ? 'Resume' : 'Start'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseButton} onPress={pause} activeOpacity={0.85}>
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
          {(remaining < totalSeconds || remaining === 0) && (
            <TouchableOpacity style={styles.resetButton} onPress={reset} activeOpacity={0.85}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
          {remaining === 0 && !isRunning && (
            <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
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
    paddingHorizontal: 22,
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
    fontSize: 14,
    fontWeight: '600',
    color: NAFS.grey,
  },
  chipTextActive: {
    color: NAFS.white,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringSvg: {
    position: 'absolute',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
    color: NAFS.navy,
    letterSpacing: 2,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '500',
    color: NAFS.grey,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttons: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 30,
    gap: 12,
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
  pauseButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: NAFS.blue,
  },
  pauseButtonText: {
    color: NAFS.blue,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resetButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: NAFS.greyLight,
  },
  resetButtonText: {
    color: NAFS.grey,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  homeButton: {
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
  homeButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
