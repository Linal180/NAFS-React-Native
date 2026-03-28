import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, NAFS } from "@/constants/theme";

type ProfileHeaderProps = {
  name: string;
  avatarUri: string | null;
  isDark: boolean;
  isSavingAvatar?: boolean;
  isSavingName?: boolean;
  onChangeName: (next: string) => void;
  onCommitName?: () => void;
  onPickAvatarPress: () => void;
};

function getInitials(name: string) {
  const cleaned = name.trim();
  if (!cleaned) return "?";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const ProfileHeader = memo(function ProfileHeader({
  name,
  avatarUri,
  isDark,
  isSavingAvatar,
  isSavingName,
  onChangeName,
  onCommitName,
  onPickAvatarPress,
}: ProfileHeaderProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <View style={styles.wrap}>
      <View style={[styles.avatarRing, { borderColor: theme.lavender }]}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarFallbackText}>{initials}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.avatarEditBtn, isDark ? { backgroundColor: "#0B1220" } : null]}
          onPress={onPickAvatarPress}
          disabled={Boolean(isSavingAvatar)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture"
        >
          <MaterialCommunityIcons
            name="camera"
            size={18}
            color={theme.primary}
            accessibilityElementsHidden
          />
        </TouchableOpacity>
      </View>

      <View style={styles.nameRow}>
        <Text style={[styles.nameLabel, { color: theme.textSecondary }]}>Name</Text>
        {isSavingName ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : null}
      </View>

      <View style={[styles.nameInputWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Your name"
          placeholderTextColor={isDark ? "#7A7A9A" : NAFS.grey}
          autoCorrect={false}
          autoCapitalize="words"
          style={[styles.nameInput, { color: theme.text }]}
          onEndEditing={onCommitName}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 18,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 26,
    fontWeight: "900",
    color: NAFS.white,
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAFS.lavender,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  nameLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  nameInputWrap: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: "800",
    padding: 0,
  },
});

