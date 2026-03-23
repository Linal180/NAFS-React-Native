import { DailyPlanCard } from "@/components/DailyPlanCard";
import { FlowIndicator, type StepKey } from "@/components/FlowIndicator";
import { MoodHistory } from "@/components/MoodHistory";
import { MoodSelector } from "@/components/MoodSelector";
import { QuoteCard } from "@/components/QuoteCard";
import { TipCard } from "@/components/TipCard";
import { BreathingIcon, ChatSupportIcon } from "@/components/ui/app-icons";
import type { MoodId } from "@/constants/moods";
import { NAFS } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import {
    loadLocalMoodState,
    persistMoodHistory,
    persistSelectedMood,
    type LocalMoodHistoryEntry,
} from "@/lib/local-mood-history";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  const [selectedMoodId, setSelectedMoodId] = useState<MoodId>("neutral");
  const [moodHistory, setMoodHistory] = useState<LocalMoodHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<StepKey[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const { selectedMoodId: savedMood, moodHistory: savedHistory } = await loadLocalMoodState();
        setSelectedMoodId(savedMood);
        setMoodHistory(savedHistory);

        // Check if mood was set today
        const lastMood = savedHistory[0];
        const isMoodToday = lastMood && new Date(lastMood.timestamp).toDateString() === new Date().toDateString();
        
        if (isMoodToday) {
          setCompletedSteps(prev => [...new Set([...prev, "mood" as StepKey])]);
        }
      } catch (error) {
        console.error("Failed to load mood state:", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleMoodSelect = useCallback(async (moodId: MoodId) => {
    setSelectedMoodId(moodId);
    await persistSelectedMood(moodId);

    const newEntry: LocalMoodHistoryEntry = {
      id: Date.now().toString(),
      moodId,
      timestamp: new Date().toISOString(),
    };

    setMoodHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 5);
      persistMoodHistory(updated);
      return updated;
    });

    setCompletedSteps(prev => [...new Set([...prev, "mood" as StepKey])]);
  }, []);

  const currentStep = useMemo((): StepKey => {
    if (!completedSteps.includes("mood")) return "mood";
    if (!completedSteps.includes("plan")) return "plan";
    if (!completedSteps.includes("exercises")) return "exercises";
    if (!completedSteps.includes("chat")) return "chat";
    return "progress";
  }, [completedSteps]);

  const handleStepPress = (step: { key: StepKey; route?: string }) => {
    if (step.route) {
      if (step.key === "chat" || step.key === "progress") {
        // These are in tabs
        router.push({
          pathname: `/(tabs)/${step.key === "chat" ? "chatbot" : "progress"}`,
          params: { mood: selectedMoodId }
        });
      } else {
        router.push({
          pathname: step.route as any,
          params: { mood: selectedMoodId }
        });
      }
      setCompletedSteps(prev => [...new Set([...prev, step.key])]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={NAFS.blue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/nafs_logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.welcome}>Hi, {firstName}</Text>
              <Text style={styles.subtitle}>Welcome back to your safe space.</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Step 1: Guided Flow Indicator */}
          <FlowIndicator 
            currentStep={currentStep} 
            completedSteps={completedSteps} 
            onStepPress={handleStepPress}
          />

          {/* Step 2: Mood Selector (Prioritized if not done) */}
          <MoodSelector 
            selectedMoodId={selectedMoodId} 
            onSelect={handleMoodSelect} 
            title={completedSteps.includes("mood") ? "How you're feeling today" : "Step 1: How are you feeling?"}
          />

          {/* Step 3: Daily Plan (Becomes prominent after mood) */}
          <DailyPlanCard 
            moodId={selectedMoodId} 
            onPressViewPlan={() => {
              setCompletedSteps(prev => [...new Set([...prev, "plan" as StepKey])]);
              router.push("/daily-plan");
            }} 
          />

          {/* Next Steps / Exercises */}
          <View style={styles.nextStepsHeader}>
            <Text style={styles.sectionTitle}>Continue your journey</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/exercises", params: { mood: selectedMoodId } })}>
              <Text style={styles.seeAll}>See Exercises →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => {
                setCompletedSteps(prev => [...new Set([...prev, "exercises" as StepKey])]);
                router.push({ pathname: "/exercises", params: { mood: selectedMoodId } });
              }}
            >
              <View style={styles.quickActionIconWrap}>
                <BreathingIcon size={24} color={NAFS.blue} />
              </View>
              <Text style={styles.quickActionText}>Exercises</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => {
                setCompletedSteps(prev => [...new Set([...prev, "chat" as StepKey])]);
                router.push({ pathname: "/(tabs)/chatbot", params: { mood: selectedMoodId } });
              }}
            >
              <View style={styles.quickActionIconWrap}>
                <ChatSupportIcon size={24} color={NAFS.blue} />
              </View>
              <Text style={styles.quickActionText}>Chat NAFS</Text>
            </TouchableOpacity>
          </View>

          <QuoteCard moodId={selectedMoodId} />
          <TipCard moodId={selectedMoodId} />
          <MoodHistory history={moodHistory} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 10,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "800",
    color: NAFS.navy,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: NAFS.grey,
    marginTop: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAFS.navy,
  },
  nextStepsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: NAFS.blue,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: NAFS.white,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  quickActionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAFS.blue + "12",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: NAFS.navy,
  },
});
