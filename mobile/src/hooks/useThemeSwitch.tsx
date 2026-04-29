import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

const THEME_MODE_KEY = "limis_theme_mode";

export type ThemeMode = "system" | "light" | "dark";
type ThemeScheme = "light" | "dark";

type ThemeTokens = {
  background: string;
  screenBg: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  label: string;
  input: string;
  inputPlaceholder: string;
  disabledButton: string;
  accentButton: string;
  primaryButtonText: string;
  tabBar: string;
  tabIconIdle: string;
  loadingIndicator: string;
};

const themeTokens: Record<ThemeScheme, ThemeTokens> = {
  light: {
    background: "#f3f6f9",
    screenBg: "bg-slate-100",
    card: "border-slate-300 bg-white",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700",
    textMuted: "text-slate-600",
    label: "text-slate-700",
    input: "border-slate-300 bg-white text-slate-900",
    inputPlaceholder: "#94a3b8",
    disabledButton: "bg-slate-300",
    accentButton: "bg-sky-600",
    primaryButtonText: "text-white",
    tabBar: "bg-white/95 border-slate-300",
    tabIconIdle: "#334155",
    loadingIndicator: "#0f172a",
  },
  dark: {
    background: "#09090b",
    screenBg: "bg-slate-950",
    card: "border-slate-800 bg-slate-900",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    label: "text-slate-300",
    input: "border-slate-700 bg-slate-950 text-slate-100",
    inputPlaceholder: "#64748b",
    disabledButton: "bg-slate-700",
    accentButton: "bg-sky-500",
    primaryButtonText: "text-slate-950",
    tabBar: "bg-slate-950/90 border-slate-800",
    tabIconIdle: "#94a3b8",
    loadingIndicator: "#e2e8f0",
  },
};

interface ThemeSwitchContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  effectiveScheme: ThemeScheme;
  backgroundColor: string;
  tokens: ThemeTokens;
}

const ThemeSwitchContext = createContext<ThemeSwitchContextValue | undefined>(undefined);

export function ThemeSwitchProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    let isMounted = true;

    const loadStoredMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (!isMounted) return;

        if (stored === "light" || stored === "dark" || stored === "system") {
          setMode(stored);
        }
      } catch {
        // Ignore read errors and keep system mode.
      }
    };

    loadStoredMode();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch(() => {
      // Ignore write errors; the toggle should still work in-memory.
    });
  }, [mode]);

  const effectiveScheme: ThemeScheme = mode === "system" ? systemScheme ?? "light" : mode;
  const tokens = themeTokens[effectiveScheme];
  const backgroundColor = tokens.background;

  const value = useMemo<ThemeSwitchContextValue>(
    () => ({
      mode,
      setMode,
      effectiveScheme,
      backgroundColor,
      tokens,
      toggleMode: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode, effectiveScheme, backgroundColor, tokens],
  );

  return <ThemeSwitchContext.Provider value={value}>{children}</ThemeSwitchContext.Provider>;
}

export function useThemeSwitch() {
  const context = useContext(ThemeSwitchContext);

  if (!context) {
    throw new Error("useThemeSwitch must be used within ThemeSwitchProvider");
  }

  return context;
}