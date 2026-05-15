import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "@/global.css";
import { AuthGate } from "@/src/components/AuthGate";
import { ThemeSwitchProvider, useThemeSwitch } from "@/src/hooks/useThemeSwitch";
import { store } from "@/src/store";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { View } from "react-native";
import { vars } from "nativewind";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeSwitchProvider>
        <RootLayoutContent />
      </ThemeSwitchProvider>
    </Provider>
  );
}

function RootLayoutContent() {
  const { backgroundColor, colorScheme, themeVars } = useThemeSwitch();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
  }, [backgroundColor]);

  return (
    <View className="flex-1 bg-[--background]" style={[vars(themeVars), { backgroundColor }]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} translucent backgroundColor="transparent" />
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthGate>
    </View>
  );
}
