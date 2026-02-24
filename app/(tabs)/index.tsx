import { ClipboardIcon } from "@/components/ui/app-icons";
import { NAFS } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

function CuteBotIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Antenna */}
      <Line
        x1="32"
        y1="8"
        x2="32"
        y2="16"
        stroke="#7EC8C8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="32" cy="6" r="4" fill="#F6C358" />
      {/* Head */}
      <Rect x="12" y="16" width="40" height="36" rx="12" fill="#7EC8C8" />
      {/* Face plate */}
      <Rect x="18" y="22" width="28" height="24" rx="8" fill="#E8F6F6" />
      {/* Eyes */}
      <Circle cx="26" cy="32" r="3.5" fill="#4A5568" />
      <Circle cx="38" cy="32" r="3.5" fill="#4A5568" />
      {/* Eye shine */}
      <Circle cx="27.5" cy="30.5" r="1.2" fill="#FFFFFF" />
      <Circle cx="39.5" cy="30.5" r="1.2" fill="#FFFFFF" />
      {/* Smile */}
      <Path
        d="M26 39 Q32 44 38 39"
        stroke="#4A5568"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ears */}
      <Rect x="6" y="28" width="6" height="10" rx="3" fill="#7EC8C8" />
      <Rect x="52" y="28" width="6" height="10" rx="3" fill="#7EC8C8" />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/nafs_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* <Text style={styles.welcome}>Welcome, {firstName}</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text> */}
        </View>

        {/* <View style={styles.moodCard}>
          <Text style={styles.moodCardEmoji}>🪞</Text>
          <Text style={styles.moodCardTitle}>Ready for a mood check?</Text>
          <Text style={styles.moodCardSub}>
            Take a quick selfie and let AI detect how you're feeling
          </Text>
          <TouchableOpacity
            style={styles.moodButton}
            activeOpacity={0.85}
            onPress={() => router.push("/selfie-capture")}
          >
            <Text style={styles.moodButtonText}>Check My Mood</Text>
          </TouchableOpacity>
        </View> */}

        {/* <Text style={styles.sectionLabel}>Quick Actions</Text> */}
        <View style={styles.tilesRow}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/selfie-capture")}
            activeOpacity={0.9}
          >
            {/* Header Section */}
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 22 }}>🧠</Text>
              <Text style={styles.headerText}>Mood Check</Text>
            </View>

            {/* Process Flow Section */}
            <View style={styles.flowContainer}>
              <View style={styles.iconCircle}>
                <Text
                  style={{ fontSize: 28, textAlign: "center", lineHeight: 34 }}
                >
                  📷
                </Text>
              </View>

              <Text style={styles.flowArrow}>→</Text>

              <View style={styles.iconCircle}>
                <CuteBotIcon size={38} />
              </View>

              <Text style={styles.flowArrow}>→</Text>

              <View style={styles.iconCircle}>
                <Text
                  style={{ fontSize: 28, textAlign: "center", lineHeight: 34 }}
                >
                  😊
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginBottom: 14 }}>
          <TouchableOpacity
            style={styles.dailyPlanTile}
            activeOpacity={0.8}
            onPress={() => router.push("/daily-plan")}
          >
            <View style={styles.dailyPlanIconWrap}>
              <ClipboardIcon size={28} color={NAFS.blue} />
            </View>
            <Text style={styles.tileText}>Daily Plan</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/chatbot")}
          >
            <View
              style={[
                styles.tileIconWrap,
                { backgroundColor: "#AB47BC" + "12" },
              ]}
            >
              <ChatSupportIcon size={28} color="#AB47BC" />
            </View>
            <Text style={styles.tileText}>AI Chat{"\n"}Support</Text>
          </TouchableOpacity> */}
        </View>
        {/* <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => router.push("/exercises")}
          >
            <View
              style={[
                styles.tileIconWrap,
                { backgroundColor: "#EE5656" + "12" },
              ]}
            >
              <MaterialCommunityIcons name="brain" size={28} color="#EE5656" />
            </View>
            <Text style={styles.tileText}>Mood Check</Text>
          </TouchableOpacity> */}
        {/* <View style={styles.tilesRow}>
          <TouchableOpacity style={styles.tile} activeOpacity={0.8}>
            <View
              style={[
                styles.tileIconWrap,
                { backgroundColor: "#26A69A" + "12" },
              ]}
            >
              <ChildIcon size={28} color="#26A69A" />
            </View>
            <Text style={styles.tileText}>Children{"\n"}Wellness</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => router.push("/exercises")}
          >
            <View
              style={[
                styles.tileIconWrap,
                { backgroundColor: "#EF5350" + "12" },
              ]}
            >
              <DumbbellIcon size={28} color="#EF5350" />
            </View>
            <Text style={styles.tileText}>Exercises</Text>
          </TouchableOpacity>
        </View> */}

        {/* <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.8}
          onPress={async () => {
            try {
              await signOut();
              if (router.canDismiss()) router.dismissAll();
              router.replace("/(auth)/login");
            } catch {
              // error handled in context
            }
          }}
        >
          <Text style={styles.signOutIcon}>↪</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: "100%",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A3A6A",
  },
  flowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EDEAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  flowArrow: {
    fontSize: 16,
    color: "#C4C4C4",
  },
  container: {
    flex: 1,
    backgroundColor: NAFS.lavender,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: NAFS.navy,
  },
  subtitle: {
    fontSize: 15,
    color: NAFS.grey,
    textAlign: "center",
    marginTop: 4,
  },
  moodCard: {
    backgroundColor: NAFS.white,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 28,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  moodCardEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  moodCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: NAFS.navy,
    marginBottom: 6,
  },
  moodCardSub: {
    fontSize: 13,
    color: NAFS.grey,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  moodButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 16,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  moodButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: NAFS.navy,
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  tilesRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
    width: "100%",
  },
  tile: {
    flex: 1,
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  dailyPlanTile: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  dailyPlanIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: NAFS.blue + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tileIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tileText: {
    fontSize: 13,
    fontWeight: "600",
    color: NAFS.navy,
    textAlign: "center",
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: NAFS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: NAFS.error + "30",
    shadowColor: NAFS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  signOutIcon: {
    fontSize: 16,
    color: NAFS.error,
  },
  signOutText: {
    color: NAFS.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
