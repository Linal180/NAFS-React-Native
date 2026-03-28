import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NAFS } from "@/constants/theme";

export type StatCardProps = {
  value: string | number;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accentColor: string; // hex
  subLabel?: string;
};

export const StatCard = memo(function StatCard({
  value,
  label,
  icon,
  accentColor,
  subLabel,
}: StatCardProps) {
  const accentBg = `${accentColor}22`;

  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />

      <View style={styles.inner}>
        <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={accentColor}
            accessibilityElementsHidden
          />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
          {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    padding: 0,
    overflow: "hidden",
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
  },
  accentLine: {
    height: 4,
    width: "100%",
  },
  inner: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: NAFS.navy,
    marginBottom: 2,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: NAFS.grey,
  },
});

