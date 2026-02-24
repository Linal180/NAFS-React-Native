import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { NAFS } from '@/constants/theme';

type NafsLogoProps = {
  size?: number;
  color?: string;
  withBackground?: boolean;
};

export function NafsLogo({ size = 48, color = NAFS.blue, withBackground = false }: NafsLogoProps) {
  const iconSize = withBackground ? size * 0.55 : size;

  const icon = (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
      <Defs>
        <LinearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
      <G>
        <Path
          d="M20 4 C20 4 8 18 8 25 C8 31.627 13.373 37 20 37 C26.627 37 32 31.627 32 25 C32 18 20 4 20 4Z"
          fill="url(#logoGrad)"
        />
        <Path
          d="M14 24 Q17 20 20 24 Q23 28 26 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M14 29 Q17 25 20 29 Q23 33 26 29"
          fill="none"
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
      </G>
    </Svg>
  );

  if (withBackground) {
    return (
      <View style={[styles.background, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '15' }]}>
        {icon}
      </View>
    );
  }

  return icon;
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
