// Design tokens — sourced from /app/design_guidelines.json.
// Emerald/botanical brand. No blues, indigos, or purples in system UI.

export type ColorScheme = "light" | "dark";

export interface Palette {
  surface: string;
  onSurface: string;
  surfaceSecondary: string;
  onSurfaceSecondary: string;
  surfaceTertiary: string;
  onSurfaceTertiary: string;
  surfaceInverse: string;
  onSurfaceInverse: string;
  brand: string;
  brandPrimary: string;
  onBrandPrimary: string;
  brandSecondary: string;
  onBrandSecondary: string;
  brandTertiary: string;
  onBrandTertiary: string;
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  error: string;
  onError: string;
  info: string;
  onInfo: string;
  border: string;
  borderStrong: string;
  divider: string;
}

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    surface: "#FFFFFF",
    onSurface: "#111827",
    surfaceSecondary: "#F9FAFB",
    onSurfaceSecondary: "#374151",
    surfaceTertiary: "#F3F4F6",
    onSurfaceTertiary: "#4B5563",
    surfaceInverse: "#111827",
    onSurfaceInverse: "#FFFFFF",
    brand: "#059669",
    brandPrimary: "#059669",
    onBrandPrimary: "#FFFFFF",
    brandSecondary: "#D1FAE5",
    onBrandSecondary: "#065F46",
    brandTertiary: "#ECFDF5",
    onBrandTertiary: "#065F46",
    success: "#16A34A",
    onSuccess: "#FFFFFF",
    warning: "#D97706",
    onWarning: "#FFFFFF",
    error: "#DC2626",
    onError: "#FFFFFF",
    info: "#4B5563",
    onInfo: "#FFFFFF",
    border: "#E5E7EB",
    borderStrong: "#9CA3AF",
    divider: "#F3F4F6",
  },
  dark: {
    surface: "#0F172A",
    onSurface: "#F8FAFC",
    surfaceSecondary: "#1E293B",
    onSurfaceSecondary: "#CBD5E1",
    surfaceTertiary: "#334155",
    onSurfaceTertiary: "#94A3B8",
    surfaceInverse: "#F8FAFC",
    onSurfaceInverse: "#0F172A",
    brand: "#10B981",
    brandPrimary: "#10B981",
    onBrandPrimary: "#022C22",
    brandSecondary: "#065F46",
    onBrandSecondary: "#D1FAE5",
    brandTertiary: "#022C22",
    onBrandTertiary: "#6EE7B7",
    success: "#22C55E",
    onSuccess: "#022C22",
    warning: "#F59E0B",
    onWarning: "#451A03",
    error: "#EF4444",
    onError: "#450A0A",
    info: "#94A3B8",
    onInfo: "#0F172A",
    border: "#334155",
    borderStrong: "#64748B",
    divider: "#1E293B",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 38,
} as const;

// Font families registered in app/_layout.tsx via expo-font.
export const fonts = {
  regular: "Jakarta-Regular",
  medium: "Jakarta-Medium",
  semibold: "Jakarta-SemiBold",
  bold: "Jakarta-Bold",
  extrabold: "Jakarta-ExtraBold",
  monoMedium: "Mono-Medium",
  monoBold: "Mono-Bold",
} as const;

export const fontAssets = {
  "Jakarta-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  "Jakarta-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
  "Jakarta-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  "Jakarta-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
  "Jakarta-ExtraBold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  "Mono-Medium": require("../../assets/fonts/JetBrainsMono-Medium.ttf"),
  "Mono-Bold": require("../../assets/fonts/JetBrainsMono-Bold.ttf"),
};

// Subtle elevation (shadow tier 1).
export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
