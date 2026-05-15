import { Ionicons } from "@expo/vector-icons";
import { useUnstableNativeVariable } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

type ThemeSwitchButtonProps = {
  compact?: boolean;
};

export default function ThemeSwitchButton({ compact = false }: ThemeSwitchButtonProps) {
  const { mode, colorScheme, toggleMode, setMode } = useThemeSwitch();
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";
  const iconName =
    mode === "system"
      ? "phone-portrait-outline"
      : colorScheme === "dark"
        ? "moon-outline"
        : "sunny-outline";

  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle theme"
        onPress={toggleMode}
        className="h-10 w-10 items-center justify-center rounded-md border border-[--border] bg-[--background]"
      >
        <Ionicons name={iconName} size={18} color={primaryColor} />
      </Pressable>
    );
  }

  return (
    <View className="rounded-lg border border-[--border] bg-[--card] p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
          <Ionicons name={iconName} size={18} color={primaryColor} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-[--foreground]">Theme</Text>
          <Text className="mt-1 text-sm capitalize text-[--muted-foreground]">
            {mode} mode
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle light or dark theme"
        onPress={toggleMode}
        className="mt-4 flex-row items-center justify-center gap-2 rounded-md bg-[--primary] px-4 py-3"
      >
        <Ionicons
          name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
          size={17}
          color="#fbf9ff"
        />
        <Text className="font-semibold text-[--primary-foreground]">
          Toggle Light/Dark
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Use system theme"
        onPress={() => setMode("system")}
        className="mt-3 flex-row items-center justify-center gap-2 rounded-md border border-[--border] px-4 py-3"
      >
        <Ionicons name="phone-portrait-outline" size={17} color={mode === "system" ? primaryColor : mutedColor} />
        <Text className="font-medium text-[--foreground]">
          Use System Theme
        </Text>
      </Pressable>
    </View>
  );
}
