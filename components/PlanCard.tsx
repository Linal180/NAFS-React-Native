import React, { useMemo, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { NAFS } from "@/constants/theme";

type PlanCardProps = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  recommended?: boolean;
};

export function PlanCard({
  title,
  description,
  icon,
  onPress,
  recommended = false,
}: PlanCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const recommendedStyles = useMemo(() => {
    if (!recommended) return null;
    return {
      borderColor: NAFS.blue + "45",
      backgroundColor: NAFS.white,
      shadowColor: NAFS.blue,
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 5,
    } as const;
  }, [recommended]);

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.86}
        onPress={onPress}
        onPressIn={() => animateTo(0.98)}
        onPressOut={() => animateTo(1)}
        style={[styles.card, recommendedStyles]}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
      >
        <View style={styles.left}>
          <View style={styles.iconWrap} accessibilityElementsHidden>
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={NAFS.blue}
            />
          </View>

          <View style={styles.text}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {recommended && (
                <View style={styles.badge} accessibilityLabel="Recommended">
                  <Text style={styles.badgeText}>Recommended</Text>
                </View>
              )}
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>

        <Ionicons
          name={Platform.select({
            ios: "chevron-forward",
            default: "chevron-forward",
          })}
          size={18}
          color={NAFS.grey}
          accessibilityElementsHidden
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: NAFS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: NAFS.greyLight,
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    minWidth: 0,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAFS.blue + "12",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: NAFS.navy,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: NAFS.grey,
  },
  badge: {
    backgroundColor: NAFS.blue + "12",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: NAFS.blue,
    letterSpacing: 0.2,
  },
});

