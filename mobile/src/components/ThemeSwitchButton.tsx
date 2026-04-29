import { Pressable, Text, View } from "react-native";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function ThemeSwitchButton() {
  const { mode, toggleMode, setMode } = useThemeSwitch();

  return (
    <View className="mt-6 rounded-2xl border border-[--border] bg-[--card] p-4">
      <Text className="text-base font-semibold text-[--foreground]">Theme</Text>
      <Text className="mt-1 text-sm text-[--muted-foreground]">Current mode: {mode}</Text>

      <Pressable onPress={toggleMode} className="mt-4 rounded-xl bg-[--primary] px-4 py-3">
        <Text className="text-center font-semibold text-[--primary-foreground]">
          Toggle Light/Dark
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setMode("system")}
        className="mt-3 rounded-xl border border-[--border] px-4 py-3"
      >
        <Text className="text-center font-medium text-[--foreground]">
          Use System Theme
        </Text>
      </Pressable>
    </View>
  );
}