import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { NAFS } from "@/constants/theme";
import { AuthProvider } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotifications } from "@/hooks/use-notifications";

const NAFSLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: NAFS.blue,
    background: NAFS.lightBg,
    card: NAFS.white,
    text: NAFS.navy,
    border: NAFS.greyLight,
  },
};

const NAFSDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: NAFS.lavender,
    background: "#0D0F1A",
    card: "#1E2140",
    text: NAFS.white,
    border: "#2A2D4A",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useNotifications();

  return (
    <AuthProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? NAFSDarkTheme : NAFSLightTheme}
      >
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="selfie-capture"
            options={{ headerShown: false, animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="mood-result"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="daily-plan"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="exercises"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="breathing-exercise"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="meditation"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="exercise-tips"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
