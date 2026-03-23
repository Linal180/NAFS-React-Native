import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  type SwitchProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NAFS } from "@/constants/theme";

export type SettingsItemProps = {
  icon: string;
  title: string;
  description?: string;
  right?:
    | { type: "switch"; value: boolean; onValueChange: (next: boolean) => void; switchProps?: Partial<SwitchProps> }
    | { type: "chevron" };
  onPress?: () => void;
  isDark: boolean;
};

export const SettingsItem = memo(function SettingsItem({
  icon,
  title,
  description,
  right,
  onPress,
  isDark,
}: SettingsItemProps) {
  const cardBg = isDark ? "#1E2140" : NAFS.white;
  const borderColor = isDark ? "#2A2D4A" : NAFS.greyLight;
  const titleColor = isDark ? NAFS.white : NAFS.navy;
  const descColor = isDark ? "#A0A0B0" : NAFS.grey;
  const iconBg = isDark ? "#3A3D5C" : NAFS.lightBg;

  const content = (
    <>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          // Cast to avoid strict glyph union type issues.
          name={icon as any}
          size={20}
          color={isDark ? NAFS.lavender : NAFS.blue}
          accessibilityElementsHidden
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: descColor }]} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightWrap}>
        {right?.type === "switch" ? (
          <Switch
            value={right.value}
            onValueChange={right.onValueChange}
            trackColor={{ false: borderColor, true: NAFS.blue + "CC" }}
            thumbColor={isDark ? "#F5F5FF" : NAFS.white}
            {...right.switchProps}
          />
        ) : right?.type === "chevron" ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={descColor}
            accessibilityElementsHidden
          />
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} accessibilityRole="button">
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>{content}</View>
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>{content}</View>;
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  rightWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});

