import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        fill="#FFC107"
      />
      <Path
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        fill="#FF3D00"
      />
      <Path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        fill="#4CAF50"
      />
      <Path
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        fill="#1976D2"
      />
    </Svg>
  );
}

/* ─── Login Screen ─── */
export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#E8E0F3", "#D5E2F2", "#CBDFF5", "#9CCEDC"]}
        locations={[0, 0.65, 0.8, 1]}
        style={styles.gradient}
      >
        {/* Top spacer */}
        <View style={styles.spacer} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo (includes brand name) */}
          <Image
            source={require("@/assets/images/nafs_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Welcome copy */}
          <Text style={styles.welcomeTitle}>Welcome to NAFSE</Text>
          <Text style={styles.welcomeSub}>Your private space to reset.</Text>

          {/* Auth buttons */}
          <View style={styles.buttons}>
            {/* Apple */}
            <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => router.replace("/(tabs)")}>
              <Ionicons name="logo-apple" size={20} color="#000" />
              <Text style={styles.btnLabel}>Continue with Apple</Text>
            </TouchableOpacity>

            {/* Google */}
            <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => router.replace("/(tabs)")}>
              <GoogleIcon size={18} />
              <Text style={styles.btnLabel}>Continue with Google</Text>
            </TouchableOpacity>

            {/* OR divider */}
            <Text style={styles.dividerLabel}>OR</Text>

            {/* Email */}
            <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => router.replace("/(tabs)")}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#5B6570"
              />
              <Text style={styles.btnLabel}>Continue with Email</Text>
            </TouchableOpacity>
          </View>

          {/* Create account link */}
          <TouchableOpacity
            style={styles.createWrap}
            onPress={() => router.push("/(auth)/signup")}
            activeOpacity={0.7}
          >
            <Text style={styles.createText}>Create an account</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer with privacy pinned at end */}
        <View style={styles.spacer}>
          <Text style={styles.privacyText}>We respect your privacy.</Text>
        </View>

        {/* Bottom peaked shapes */}
        <View style={styles.wavesContainer} pointerEvents="none">
          {/* Back triangle — taller */}
          <Svg
            width={SCREEN_WIDTH}
            height={230}
            viewBox={`0 0 ${SCREEN_WIDTH} 230`}
            style={styles.wave}
          >
            <Path
              d={`M${SCREEN_WIDTH},230 L${SCREEN_WIDTH},5 C${SCREEN_WIDTH * 0.65},90 ${SCREEN_WIDTH * 0.3},150 0,230 Z`}
              fill="rgba(140,200,205,0.15)"
            />
          </Svg>
          {/* Front triangle */}
          <Svg
            width={SCREEN_WIDTH}
            height={230}
            viewBox={`0 0 ${SCREEN_WIDTH} 230`}
            style={styles.wave}
          >
            <Path
              d={`M${SCREEN_WIDTH},230 L${SCREEN_WIDTH},25 C${SCREEN_WIDTH * 0.65},95 ${SCREEN_WIDTH * 0.3},150 0,230 Z`}
              fill="rgba(120,190,195,0.18)"
            />
          </Svg>
        </View>
      </LinearGradient>
    </View>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 36,
  },
  spacer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },

  /* Logo */
  logo: {
    width: 160,
    height: 160,
    marginBottom: 12,
  },

  /* Welcome */
  welcomeTitle: {
    fontSize: 21,
    fontWeight: "500",
    color: "#3D4F5C",
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 14,
    color: "#9494A0",
    marginBottom: 28,
  },

  /* Buttons */
  buttons: {
    width: "100%",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "rgba(210,215,220,0.35)",
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3B4553",
  },

  /* Divider */
  dividerLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginVertical: 2,
  },

  /* Create account */
  createWrap: {
    marginTop: 22,
  },
  createText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A9BAA",
  },

  /* Privacy */
  privacyText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 32,
  },

  /* Bottom waves */
  wavesContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  wave: {
    position: "absolute",
    bottom: 0,
  },
});
