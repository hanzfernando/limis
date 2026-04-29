import { Pressable, Text, View } from "react-native";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function ThemeSwitchButton() {
  const { mode, tokens, toggleMode, setMode } = useThemeSwitch();

  return (
    <View className={`mt-6 rounded-2xl border p-4 ${tokens.card}`}>
      <Text className={`text-base font-semibold ${tokens.textPrimary}`}>Theme</Text>
      <Text className={`mt-1 text-sm ${tokens.textMuted}`}>Current mode: {mode}</Text>

      <Pressable onPress={toggleMode} className={`mt-4 rounded-xl px-4 py-3 ${tokens.accentButton}`}>
        <Text className="text-center font-semibold text-white">Toggle Light/Dark</Text>
      </Pressable>

      <Pressable onPress={() => setMode("system")} className="mt-3 rounded-xl border border-slate-500/40 px-4 py-3">
        <Text className={`text-center font-medium ${tokens.textPrimary}`}>Use System Theme</Text>
      </Pressable>
    </View>
  );
}