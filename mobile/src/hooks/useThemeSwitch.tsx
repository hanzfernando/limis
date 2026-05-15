import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "nativewind";

const THEME_MODE_KEY = "limis_theme_mode";

export type ThemeMode = "system" | "light" | "dark";
type ThemeScheme = "light" | "dark";

type ThemeVariables = Record<string, string>;

const themeVariables: Record<ThemeScheme, ThemeVariables> = {
  light: {
    "--background": "#f3f6f9",
    "--foreground": "#111827",
    "--card": "#ffffff",
    "--card-foreground": "#111827",
    "--popover": "#ffffff",
    "--popover-foreground": "#111827",
    "--primary": "#2563eb",
    "--primary-foreground": "#ffffff",
    "--secondary": "#e5e7eb",
    "--secondary-foreground": "#111827",
    "--muted": "#f9fafb",
    "--muted-foreground": "#6b7280",
    "--accent": "#dbeafe",
    "--accent-foreground": "#1e3a8a",
    "--destructive": "#ef4444",
    "--destructive-foreground": "#ffffff",
    "--border": "#d1d5db",
    "--input": "#d1d5db",
    "--ring": "#2563eb",
    "--success": "#10b981",
    "--success-foreground": "#ffffff",
    "--radius": "0.625rem",
  },
  dark: {
    "--background": "#09090b",
    "--foreground": "#f4f4f5",
    "--card": "#18181b",
    "--card-foreground": "#f4f4f5",
    "--popover": "#18181b",
    "--popover-foreground": "#f4f4f5",
    "--primary": "#60a5fa",
    "--primary-foreground": "#0f172a",
    "--secondary": "#27272a",
    "--secondary-foreground": "#f4f4f5",
    "--muted": "#27272a",
    "--muted-foreground": "#a1a1aa",
    "--accent": "#1f2937",
    "--accent-foreground": "#e5e7eb",
    "--destructive": "#f87171",
    "--destructive-foreground": "#111827",
    "--border": "#3f3f46",
    "--input": "#3f3f46",
    "--ring": "#60a5fa",
    "--success": "#22c55e",
    "--success-foreground": "#052e16",
    "--radius": "0.625rem",
  },
};

interface ThemeSwitchContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colorScheme: ThemeScheme;
  backgroundColor: string;
  themeVars: ThemeVariables;
}

const ThemeSwitchContext = createContext<ThemeSwitchContextValue | undefined>(undefined);

export function ThemeSwitchProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    let isMounted = true;

    const loadStoredMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (!isMounted) return;

        if (stored === "light" || stored === "dark" || stored === "system") {
          setMode(stored);
          setColorScheme(stored);
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
    setColorScheme(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch(() => {
      // Ignore write errors; the toggle should still work in-memory.
    });
  }, [mode, setColorScheme]);

  const effectiveScheme: ThemeScheme = colorScheme === "dark" ? "dark" : "light";
  const themeVars = themeVariables[effectiveScheme];
  const backgroundColor = themeVars["--background"];

  const value = useMemo<ThemeSwitchContextValue>(
    () => ({
      mode,
      setMode,
      colorScheme: effectiveScheme,
      backgroundColor,
      themeVars,
      toggleMode: () =>
        setMode((current) => {
          if (current === "system") {
            return effectiveScheme === "dark" ? "light" : "dark";
          }
          return current === "dark" ? "light" : "dark";
        }),
    }),
    [mode, effectiveScheme, backgroundColor, themeVars],
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