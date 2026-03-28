import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, NAFS } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { loadLocalMoodState } from "@/lib/local-mood-history";
import { getMoodMeta, type MoodId } from "@/constants/moods";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SettingsItem } from "@/components/profile/SettingsItem";
import { MoodHistoryItem } from "@/components/profile/MoodHistoryItem";

type LanguageId = "en" | "ur";

const STORAGE_KEYS = {
  name: "nafs_profile_display_name_v1",
  avatarUri: "nafs_profile_avatar_uri_v1",
  darkMode: "nafs_pref_dark_mode_v1",
  notifications: "nafs_pref_notifications_v1",
  language: "nafs_pref_language_v1",
} as const;

const LANG_LABELS: Record<LanguageId, string> = {
  en: "English",
  ur: "Urdu",
};

const MOCK_MOOD_EMOJIS = ["🙂", "😐", "🙂", "😔", "😐", "🙂", "😔"] as const;

function getDayKeyLocal(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getLastNDays(n: number, now = new Date()) {
  const days: { dayKey: string; label: string }[] = [];
  for (let offset = n - 1; offset >= 0; offset--) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset);
    days.push({
      dayKey: getDayKeyLocal(d),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

function getMoodEmojiByMoodId(moodId: MoodId) {
  return getMoodMeta(moodId).emoji;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isLoading: isAuthLoading } = useAuth();

  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [hasSavedName, setHasSavedName] = useState(false);

  const [name, setName] = useState<string>(user?.displayName || "User");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [language, setLanguage] = useState<LanguageId>("en");
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  const [moodHistory, setMoodHistory] = useState<
    { id: string; moodId: MoodId; timestamp: string }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [
          storedName,
          storedAvatarUri,
          storedDarkMode,
          storedNotifications,
          storedLanguage,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.name),
          AsyncStorage.getItem(STORAGE_KEYS.avatarUri),
          AsyncStorage.getItem(STORAGE_KEYS.darkMode),
          AsyncStorage.getItem(STORAGE_KEYS.notifications),
          AsyncStorage.getItem(STORAGE_KEYS.language),
        ]);

        if (!mounted) return;

        if (typeof storedName === "string" && storedName.trim().length > 0) {
          setName(storedName);
          setHasSavedName(true);
        }
        if (typeof storedAvatarUri === "string" && storedAvatarUri.length > 0) {
          setAvatarUri(storedAvatarUri);
        }
        if (storedDarkMode === "true") setDarkMode(true);
        if (storedNotifications === "false") setNotificationsEnabled(false);
        if (storedLanguage === "ur") setLanguage("ur");
      } catch {
        // ignore and fall back to defaults
      } finally {
        if (mounted) setPrefsLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    if (!hasSavedName) {
      setName(user?.displayName || "User");
    }
  }, [prefsLoaded, hasSavedName, user?.displayName]);

  useEffect(() => {
    if (!prefsLoaded) return;
    // Persist preference toggles immediately.
    AsyncStorage.setItem(STORAGE_KEYS.darkMode, String(darkMode));
    AsyncStorage.setItem(
      STORAGE_KEYS.notifications,
      String(notificationsEnabled),
    );
    AsyncStorage.setItem(STORAGE_KEYS.language, language);
  }, [prefsLoaded, darkMode, notificationsEnabled, language]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const local = await loadLocalMoodState();
        if (!mounted) return;
        setMoodHistory(
          local.moodHistory.map((e) => ({
            id: e.id,
            moodId: e.moodId,
            timestamp: e.timestamp,
          })),
        );
      } catch {
        if (!mounted) return;
        setMoodHistory([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const theme = useMemo(() => (darkMode ? Colors.dark : Colors.light), [darkMode]);

  const handleLogout = async () => {
    try {
      await signOut();
      if (router.canDismiss()) router.dismissAll();
      router.replace("/(auth)/login");
    } catch {
      // error handled in context
    }
  };

  const commitName = useCallback(async () => {
    const trimmed = name.trim();
    setIsSavingName(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.name, trimmed.length ? trimmed : "User");
      setHasSavedName(true);
    } finally {
      setIsSavingName(false);
    }
  }, [name]);

  const pickAvatar = useCallback(async () => {
    setIsSavingAvatar(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
        await AsyncStorage.setItem(STORAGE_KEYS.avatarUri, result.assets[0].uri);
      }
    } finally {
      setIsSavingAvatar(false);
    }
  }, []);

  const moodCards = useMemo(() => {
    if (moodHistory.length) {
      const sorted = [...moodHistory].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      const recent = sorted.slice(-7);

      return recent.map((entry) => {
        const d = new Date(entry.timestamp);
        return {
          dayKey: entry.id,
          dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
          emoji: getMoodEmojiByMoodId(entry.moodId),
        };
      });
    }

    const days = getLastNDays(7);
    const byDay = new Map<string, { id: string; moodId: MoodId; timestamp: string }>();

    for (const entry of moodHistory) {
      const ts = new Date(entry.timestamp);
      const key = getDayKeyLocal(ts);
      const existing = byDay.get(key);
      if (!existing || ts > new Date(existing.timestamp)) {
        byDay.set(key, entry);
      }
    }

    return days.map((d, idx) => {
      const entry = byDay.get(d.dayKey);
      const emoji = entry ? getMoodEmojiByMoodId(entry.moodId) : MOCK_MOOD_EMOJIS[idx] ?? "😐";
      return { dayKey: d.dayKey, dayLabel: d.label, emoji };
    });
  }, [moodHistory]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ProfileHeader
            name={name}
            avatarUri={avatarUri}
            isDark={darkMode}
            isSavingAvatar={isSavingAvatar}
            isSavingName={isSavingName}
            onChangeName={setName}
            onCommitName={commitName}
            onPickAvatarPress={pickAvatar}
          />
          <View style={styles.subtleRow}>
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "700" }}>
              Signed in as {user?.email || "—"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>

          <View style={styles.settingStack}>
            <SettingsItem
              icon="translate"
              isDark={darkMode}
              title="Language"
              description={`Current: ${LANG_LABELS[language]}`}
              right={{
                type: "switch",
                value: language === "ur",
                onValueChange: (next) => setLanguage(next ? "ur" : "en"),
              }}
            />

            <SettingsItem
              icon="theme-light-dark"
              isDark={darkMode}
              title="Dark Mode"
              description={darkMode ? "Enabled" : "Disabled"}
              right={{
                type: "switch",
                value: darkMode,
                onValueChange: setDarkMode,
              }}
            />

            <SettingsItem
              icon="bell-outline"
              isDark={darkMode}
              title="Notifications"
              description={notificationsEnabled ? "On (mood reminders)" : "Off"}
              right={{
                type: "switch",
                value: notificationsEnabled,
                onValueChange: setNotificationsEnabled,
              }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mood History</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "800" }}>
              Last 7 days
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>
            {moodCards.map((d) => (
              <MoodHistoryItem key={d.dayKey} dayLabel={d.dayLabel} emoji={d.emoji} isDark={darkMode} />
            ))}
          </ScrollView>

          {!moodHistory.length ? (
            <Text style={[styles.moodEmptyText, { color: theme.textSecondary }]}>
              Add mood check-ins to see your recent trend.
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: darkMode ? "#FF6B6B" : NAFS.error }]}
          activeOpacity={0.85}
          onPress={handleLogout}
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <ActivityIndicator color={darkMode ? "#FF6B6B" : NAFS.error} />
          ) : (
            <Text style={[styles.logoutText, { color: darkMode ? "#FF6B6B" : NAFS.error }]}>Logout</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textSecondary }]}>NAFS v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  subtleRow: {
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  section: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  settingStack: {
    gap: 12,
  },
  moodRow: {
    paddingVertical: 6,
    gap: 12,
    alignItems: "center",
  },
  moodEmptyText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: NAFS.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "800",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
});
