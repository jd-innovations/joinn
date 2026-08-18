import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { storage } from "@/src/utils/storage";
import {
  ColorScheme,
  Palette,
  palettes,
  spacing,
  radius,
  fontSize,
  fonts,
  shadow,
} from "./tokens";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "sideline.theme.mode";

interface ThemeContextValue {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fonts: typeof fonts;
  shadow: typeof shadow;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<ThemeMode>(STORAGE_KEY, "system");
      if (saved) setModeState(saved);
    })();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.setItem(STORAGE_KEY, next);
  }, []);

  const scheme: ColorScheme =
    mode === "system" ? (system === "dark" ? "dark" : "light") : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors: palettes[scheme],
      spacing,
      radius,
      fontSize,
      fonts,
      shadow,
      setMode,
    }),
    [mode, scheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
