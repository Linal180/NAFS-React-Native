import Svg, { Path, G, Circle, Rect, Line } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
};

type CircleIconProps = IconProps & {
  bgColor?: string;
};

function IconWrap({ size = 48, bgColor, children }: { size: number; bgColor?: string; children: React.ReactNode }) {
  if (!bgColor) return <>{children}</>;
  return (
    <View style={[styles.iconBg, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: bgColor }]}>
      {children}
    </View>
  );
}

// --- Exercise & Daily Plan Icons ---

export function BreathingIcon({ size = 24, color = '#26A69A', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M12 3C12 3 4 10 4 15C4 19.418 7.582 22 12 22C16.418 22 20 19.418 20 15C20 10 12 3 12 3Z" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M8 14Q10 11 12 14Q14 17 16 14" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </IconWrap>
  );
}

export function JournalIcon({ size = 24, color = '#5C6BC0', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke={color} strokeWidth={1.8} />
        <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1="8" y1="16" x2="13" y2="16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </IconWrap>
  );
}

export function MeditationIcon({ size = 24, color = '#AB47BC', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Circle cx="12" cy="6" r="2.5" fill="none" stroke={color} strokeWidth={1.8} />
        <Path d="M12 9V14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M8 12L12 14L16 12" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6 19Q9 16 12 19Q15 16 18 19" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </IconWrap>
  );
}

export function ExerciseIcon({ size = 24, color = '#EF5350', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M6 12H18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M4 8V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M7 9V15" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M17 9V15" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M20 8V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </IconWrap>
  );
}

export function GratitudeIcon({ size = 24, color = '#FFB74D', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9 4C10.5 4 11.5 5 12 5.5C12.5 5 13.5 4 15 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </IconWrap>
  );
}

export function MusicIcon({ size = 24, color = '#42A5F5', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M9 18V6L21 4V16" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx="6" cy="18" r="3" fill="none" stroke={color} strokeWidth={1.8} />
        <Circle cx="18" cy="16" r="3" fill="none" stroke={color} strokeWidth={1.8} />
      </Svg>
    </IconWrap>
  );
}

export function SunriseIcon({ size = 24, color = '#FFB74D', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M12 2V5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M4.93 10.93L7.05 13.05" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M19.07 10.93L16.95 13.05" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M2 18H22" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M6 18C6 14.686 8.686 12 12 12C15.314 12 18 14.686 18 18" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </IconWrap>
  );
}

export function TargetIcon({ size = 24, color = '#4A5ACF', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth={1.8} />
        <Circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth={1.8} />
        <Circle cx="12" cy="12" r="1.5" fill={color} />
      </Svg>
    </IconWrap>
  );
}

export function QuoteIcon({ size = 24, color = '#AB47BC', bgColor }: CircleIconProps) {
  return (
    <IconWrap size={size} bgColor={bgColor}>
      <Svg width={bgColor ? size * 0.5 : size} height={bgColor ? size * 0.5 : size} viewBox="0 0 24 24">
        <Path d="M10 8H6C5 8 4 9 4 10V12C4 13 5 14 6 14H8C9 14 10 13 10 12V8C10 6 8 4 6 4" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M20 8H16C15 8 14 9 14 10V12C14 13 15 14 16 14H18C19 14 20 13 20 12V8C20 6 18 4 16 4" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </IconWrap>
  );
}

// --- Social Login Icons ---

export function GoogleIcon({ size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
      <Path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.69 5.84 14.09H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <Path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.09Z" fill="#FBBC05" />
      <Path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.91C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
    </Svg>
  );
}

export function AppleIcon({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M17.05 20.28C16.07 21.23 15 21.08 13.97 20.63C12.88 20.17 11.88 20.15 10.73 20.63C9.29 21.25 8.53 21.07 7.67 20.28C2.79 15.25 3.51 7.59 9.05 7.31C10.4 7.38 11.34 8.05 12.13 8.11C13.31 7.87 14.44 7.18 15.71 7.28C17.22 7.41 18.36 8.05 19.1 9.19C15.98 11.03 16.72 15.12 19.57 16.35C18.98 17.87 18.2 19.37 17.04 20.29L17.05 20.28ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3C16.07 5.58 13.43 7.5 12.03 7.25Z" fill={color} />
    </Svg>
  );
}

// --- Chat & UI Icons ---

export function BotIcon({ size = 24, color = '#4A5ACF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="8" width="18" height="12" rx="3" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="14" r="1.5" fill={color} />
      <Circle cx="15" cy="14" r="1.5" fill={color} />
      <Path d="M12 4V8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="3" r="1.5" fill={color} />
      <Path d="M1 13H3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M21 13H23" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

// --- Home Tile Icons ---

export function ClipboardIcon({ size = 24, color = '#4A5ACF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M9 2H15V4C15 5 14 6 12 6C10 6 9 5 9 4V2Z" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="9" y1="10" x2="15" y2="10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function ChatSupportIcon({ size = 24, color = '#4A5ACF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 12C21 16.418 16.97 20 12 20C10.5 20 9.1 19.7 7.84 19.14L3 20L4.3 16.5C3.48 15.16 3 13.63 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="8.5" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="15.5" cy="12" r="1" fill={color} />
    </Svg>
  );
}

export function ChildIcon({ size = 24, color = '#4A5ACF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M5 21V19C5 16.238 7.238 14 10 14H14C16.762 14 19 16.238 19 19V21" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M9 7C9 7 10 9 12 9C14 9 15 7 15 7" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function DumbbellIcon({ size = 24, color = '#4A5ACF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6.5 12H17.5" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Rect x="3" y="8" width="3" height="8" rx="1" fill="none" stroke={color} strokeWidth={1.8} />
      <Rect x="18" y="8" width="3" height="8" rx="1" fill="none" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  iconBg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
