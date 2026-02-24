import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NAFS } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { getMoodHistory, type StoredMoodEntry } from '@/lib/mood-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const MOOD_SCORES: Record<string, number> = {
  Happy: 90,
  Calm: 75,
  Neutral: 50,
  Surprised: 55,
  Tired: 35,
  Sad: 25,
  Anxious: 20,
  Angry: 15,
};

const CHART_WIDTH = screenWidth - 80;
const CHART_HEIGHT = 180;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;
const plotWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const MAX_VAL = 100;

function buildSmoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const tension = 0.3;
    const dx = next.x - curr.x;
    d += ` C ${curr.x + dx * tension},${curr.y} ${next.x - dx * tension},${next.y} ${next.x},${next.y}`;
  }
  return d;
}

function buildAreaPath(pts: { x: number; y: number }[]) {
  const linePath = buildSmoothPath(pts);
  const bottomY = PADDING_TOP + plotHeight;
  return `${linePath} L ${pts[pts.length - 1].x},${bottomY} L ${pts[0].x},${bottomY} Z`;
}

function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export default function ProgressScreen() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<StoredMoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let active = true;
      setLoading(true);
      getMoodHistory(user.uid, 30)
        .then((data) => { if (active) setEntries(data); })
        .catch((e) => console.error('Failed to load mood history:', e))
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [user]),
  );

  // Reverse to chronological order for chart
  const chronological = [...entries].reverse();

  const graphData = chronological.map((e) => ({
    label: formatDate(e.timestamp),
    value: MOOD_SCORES[e.mood] ?? 50,
    emoji: e.emoji,
  }));

  const points = graphData.map((d, i) => {
    const count = Math.max(graphData.length - 1, 1);
    const x = PADDING_LEFT + (i / count) * plotWidth;
    const y = PADDING_TOP + plotHeight - (d.value / MAX_VAL) * plotHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = points.length >= 2 ? buildSmoothPath(points) : '';
  const areaPath = points.length >= 2 ? buildAreaPath(points) : '';
  const yLabels = [0, 25, 50, 75, 100];

  // Stats
  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const avgScore = entries.length > 0
    ? Math.round(entries.reduce((sum, e) => sum + (MOOD_SCORES[e.mood] ?? 50), 0) / entries.length)
    : 0;
  const latestMood = entries.length > 0 ? entries[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/nafs_logo.png')}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Mental Well-being Progress</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={NAFS.blue} />
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No mood data yet</Text>
            <Text style={styles.emptyText}>Check your mood from the home screen to start tracking your progress.</Text>
          </View>
        ) : (
          <>
            {/* Recent moods row */}
            <View style={styles.recentRow}>
              {entries.slice(0, 5).map((e, i) => (
                <View key={e.id} style={styles.recentItem}>
                  <Text style={styles.recentEmoji}>{e.emoji}</Text>
                  <Text style={styles.recentDate}>{formatDate(e.timestamp)}</Text>
                </View>
              ))}
            </View>

            {/* Graph */}
            {points.length >= 2 && (
              <View style={styles.graphCard}>
                <Text style={styles.graphTitle}>Mood Score</Text>
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                  <Defs>
                    <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={NAFS.blue} stopOpacity="0.25" />
                      <Stop offset="1" stopColor={NAFS.blue} stopOpacity="0.02" />
                    </LinearGradient>
                  </Defs>

                  {yLabels.map((val) => {
                    const y = PADDING_TOP + plotHeight - (val / MAX_VAL) * plotHeight;
                    return (
                      <G key={val}>
                        <Line
                          x1={PADDING_LEFT} y1={y}
                          x2={CHART_WIDTH - PADDING_RIGHT} y2={y}
                          stroke={NAFS.greyLight} strokeWidth={0.8} strokeDasharray="4,4"
                        />
                        <SvgText x={PADDING_LEFT - 10} y={y + 4} fontSize={10} fill={NAFS.grey} textAnchor="end">{val}</SvgText>
                      </G>
                    );
                  })}

                  <Path d={areaPath} fill="url(#areaGradient)" />
                  <Path d={linePath} fill="none" stroke={NAFS.blue} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                  {points.map((p, i) => (
                    <G key={i}>
                      <Circle cx={p.x} cy={p.y} r={8} fill={NAFS.blue} opacity={0.12} />
                      <Circle cx={p.x} cy={p.y} r={4.5} fill={NAFS.white} stroke={NAFS.blue} strokeWidth={2.5} />
                    </G>
                  ))}

                  {points.map((p, i) => (
                    <SvgText key={`l${i}`} x={p.x} y={CHART_HEIGHT - 8} fontSize={9} fill={NAFS.grey} textAnchor="middle">{p.label}</SvgText>
                  ))}
                </Svg>
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.statLabel}>Most Common Mood</Text>
                </View>
                <Text style={styles.statValue}>{topMood ? topMood[0] : '—'}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <View style={[styles.statDot, { backgroundColor: NAFS.blue }]} />
                  <Text style={styles.statLabel}>Average Score</Text>
                </View>
                <Text style={styles.statValue}>{avgScore}%</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <View style={[styles.statDot, { backgroundColor: '#AB47BC' }]} />
                  <Text style={styles.statLabel}>Total Check-ins</Text>
                </View>
                <Text style={styles.statValue}>{entries.length}</Text>
              </View>

              {latestMood && (
                <View style={styles.statCard}>
                  <View style={styles.statIconRow}>
                    <Text style={{ fontSize: 16 }}>{latestMood.emoji}</Text>
                    <Text style={styles.statLabel}>Latest Mood</Text>
                  </View>
                  <Text style={styles.statValue}>{latestMood.mood}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.navy,
    letterSpacing: 4,
    marginTop: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: NAFS.blue,
  },
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NAFS.navy,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: NAFS.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  recentItem: {
    alignItems: 'center',
    gap: 4,
  },
  recentEmoji: {
    fontSize: 28,
  },
  recentDate: {
    fontSize: 10,
    color: NAFS.navy,
    fontWeight: '500',
  },
  graphCard: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  graphTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: NAFS.grey,
    letterSpacing: 0.5,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 12,
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: NAFS.navy,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: NAFS.blue,
  },
});
