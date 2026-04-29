import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function AuthLayout() {
  const { backgroundColor } = useThemeSwitch();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </SafeAreaView>
  );
}
