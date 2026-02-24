import { Platform } from 'react-native';

// NAFS App Color Palette (from Figma)
export const NAFS = {
  navy: '#1B1F3B',
  blue: '#4A5ACF',
  lavender: '#C5C6EF',
  lightBg: '#F0F0FF',
  white: '#FFFFFF',
  grey: '#7C7C8A',
  greyLight: '#E8E8F0',
  accentBlue: '#5B9FE3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF4444',
};

export const Colors = {
  light: {
    text: NAFS.navy,
    textSecondary: NAFS.grey,
    background: NAFS.lightBg,
    card: NAFS.white,
    tint: NAFS.blue,
    icon: NAFS.grey,
    tabIconDefault: NAFS.grey,
    tabIconSelected: NAFS.blue,
    border: NAFS.greyLight,
    primary: NAFS.blue,
    lavender: NAFS.lavender,
  },
  dark: {
    text: NAFS.white,
    textSecondary: '#A0A0B0',
    background: '#0D0F1A',
    card: '#1E2140',
    tint: NAFS.lavender,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: NAFS.lavender,
    border: '#2A2D4A',
    primary: NAFS.lavender,
    lavender: '#3A3D5C',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
