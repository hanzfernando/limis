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
  const { backgroundColor, effectiveScheme } = useThemeSwitch();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
  }, [backgroundColor]);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <StatusBar style={effectiveScheme === "dark" ? "light" : "dark"} translucent backgroundColor="transparent" />
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