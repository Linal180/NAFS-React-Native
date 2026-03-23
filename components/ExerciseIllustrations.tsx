import React from "react";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

export function BreathingIllustration({ size = 180, color = "#26A69A" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="90" r="74" fill={color + "18"} />
      <Circle cx="90" cy="90" r="56" fill={color + "24"} />
      <Circle cx="90" cy="90" r="36" fill={color + "35"} />
      <Path
        d="M54 96 C64 70, 80 64, 90 80 C100 64, 116 70, 126 96"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M68 114 C76 128, 104 128, 112 114"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function JournalingIllustration({ size = 180, color = "#5C6BC0" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Rect x="34" y="34" width="112" height="112" rx="22" fill={color + "14"} />
      <Rect x="48" y="48" width="84" height="84" rx="18" fill="#FFFFFF" />
      <Rect x="58" y="62" width="64" height="10" rx="5" fill={color + "55"} />
      <Rect x="58" y="82" width="52" height="10" rx="5" fill={color + "45"} />
      <Rect x="58" y="102" width="60" height="10" rx="5" fill={color + "35"} />
      <Path d="M108 122 L124 106" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <Path d="M122 108 L128 114" stroke={color} strokeWidth="8" strokeLinecap="round" />
    </Svg>
  );
}

export function MeditationIllustration({ size = 180, color = "#AB47BC" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="56" r="18" fill={color + "40"} />
      <Path d="M54 116 C68 94, 78 90, 90 94 C102 90, 112 94, 126 116" fill={color + "22"} />
      <Path
        d="M60 114 C76 104, 104 104, 120 114"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M42 78 C52 66, 60 62, 70 66"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M138 78 C128 66, 120 62, 110 66"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="90" cy="90" r="70" fill="none" stroke={color + "22"} strokeWidth="6" />
    </Svg>
  );
}

export function StressReliefIllustration({ size = 180, color = "#EF5350" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="90" r="74" fill={color + "14"} />
      <Rect x="54" y="70" width="72" height="48" rx="20" fill="#FFFFFF" />
      <Circle cx="76" cy="92" r="6" fill={color + "80"} />
      <Circle cx="104" cy="92" r="6" fill={color + "80"} />
      <Path
        d="M78 108 Q90 116 102 108"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Line x1="90" y1="50" x2="90" y2="66" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="90" cy="46" r="8" fill={color + "80"} />
      <Path
        d="M34 106 C40 98, 48 94, 58 98"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M146 106 C140 98, 132 94, 122 98"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function GratitudeIllustration({ size = 180, color = "#FFB74D" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="90" r="74" fill={color + "18"} />
      <Path
        d="M90 132 C62 114, 48 96, 48 78 C48 66, 58 56, 70 56 C78 56, 86 60, 90 68 C94 60, 102 56, 110 56 C122 56, 132 66, 132 78 C132 96, 118 114, 90 132 Z"
        fill={color + "70"}
      />
      <Path d="M66 78 L74 78" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <Path d="M106 78 L114 78" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <Path d="M72 96 Q90 108 108 96" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function RelaxationIllustration({ size = 180, color = "#42A5F5" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="90" r="74" fill={color + "16"} />
      <Path d="M56 110 C70 94, 80 92, 90 98 C100 92, 110 94, 124 110" fill="#FFFFFF" />
      <Path
        d="M62 112 C74 104, 106 104, 118 112"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M60 74 C72 62, 80 60, 90 66 C100 60, 108 62, 120 74"
        stroke={color + "80"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M50 88 C60 78, 66 76, 74 80"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M130 88 C120 78, 114 76, 106 80"
        stroke={color + "66"}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

