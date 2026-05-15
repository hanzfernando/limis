import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useColorScheme } from "nativewind";
import { Appearance } from "react-native";

const THEME_MODE_KEY = "limis_theme_mode";

export type ThemeMode = "system" | "light" | "dark";
type ThemeScheme = "light" | "dark";

type ThemeVariables = Record<string, string>;

const themeVariables: Record<ThemeScheme, ThemeVariables> = {
  light: {
    "--background": "#f7f6fb",
    "--foreground": "#181424",
    "--card": "#fffefe",
    "--card-foreground": "#181424",
    "--popover": "#fffefe",
    "--popover-foreground": "#181424",
    "--primary": "#5d3c8f",
    "--primary-foreground": "#fbf9ff",
    "--secondary": "#ebe7f3",
    "--secondary-foreground": "#241c35",
    "--muted": "#efedf5",
    "--muted-foreground": "#756e83",
    "--accent": "#e8e1f5",
    "--accent-foreground": "#3a255e",
    "--destructive": "#ef4444",
    "--destructive-foreground": "#ffffff",
    "--border": "#d9d4e5",
    "--input": "#ebe7f3",
    "--ring": "#7a5dae",
    "--success": "#2f9b77",
    "--success-foreground": "#ffffff",
    "--radius": "0.5rem",
  },
  dark: {
    "--background": "#0d0a14",
    "--foreground": "#f3f0f8",
    "--card": "#15111f",
    "--card-foreground": "#f3f0f8",
    "--popover": "#15111f",
    "--popover-foreground": "#f3f0f8",
    "--primary": "#bda6e4",
    "--primary-foreground": "#170f24",
    "--secondary": "#221b31",
    "--secondary-foreground": "#eee9f8",
    "--muted": "#211a2c",
    "--muted-foreground": "#a89db8",
    "--accent": "#2a203a",
    "--accent-foreground": "#f0ebf8",
    "--destructive": "#f87171",
    "--destructive-foreground": "#1b1016",
    "--border": "#31273f",
    "--input": "#221b31",
    "--ring": "#bda6e4",
    "--success": "#72d6b1",
    "--success-foreground": "#0c241a",
    "--radius": "0.5rem",
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
  const { setColorScheme } = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");
  const userSelectedModeRef = useRef(false);
  const [systemScheme, setSystemScheme] = useState<ThemeScheme>(
    Appearance.getColorScheme() === "dark" ? "dark" : "light",
  );

  const applyMode = useCallback(
    (nextMode: ThemeMode, userSelected = true) => {
      if (userSelected) {
        userSelectedModeRef.current = true;
      }

      setMode(nextMode);
      setColorScheme(nextMode);
      AsyncStorage.setItem(THEME_MODE_KEY, nextMode).catch(() => {
        // Ignore write errors; the toggle should still work in-memory.
      });
    },
    [setColorScheme],
  );

  useEffect(() => {
    let isMounted = true;

    const loadStoredMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (!isMounted) return;

        if (stored === "light" || stored === "dark" || stored === "system") {
          if (!userSelectedModeRef.current) {
            applyMode(stored, false);
          }
        }
      } catch {
        // Ignore read errors and keep system mode.
      }
    };

    loadStoredMode();

    return () => {
      isMounted = false;
    };
  }, [applyMode]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => subscription.remove();
  }, []);

  const effectiveScheme: ThemeScheme = mode === "system" ? systemScheme : mode;
  const themeVars = themeVariables[effectiveScheme];
  const backgroundColor = themeVars["--background"];

  const value = useMemo<ThemeSwitchContextValue>(
    () => ({
      mode,
      setMode: applyMode,
      colorScheme: effectiveScheme,
      backgroundColor,
      themeVars,
      toggleMode: () => {
        const nextMode =
          mode === "system"
            ? effectiveScheme === "dark"
              ? "light"
              : "dark"
            : mode === "dark"
              ? "light"
              : "dark";

        applyMode(nextMode);
      },
    }),
    [applyMode, mode, effectiveScheme, backgroundColor, themeVars],
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
