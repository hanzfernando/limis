import { View, Text } from "react-native";
import ThemeSwitchButton from "@/src/components/ThemeSwitchButton";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function ProfileScreen() {
  const { tokens } = useThemeSwitch();

  return (
    <View className={`flex-1 ${tokens.screenBg}`}>
      <View className="flex-1 px-6 py-8">
        <Text className={`text-3xl font-semibold ${tokens.textPrimary}`}>Profile</Text>
        <Text className={`mt-2 text-base ${tokens.textSecondary}`}>This is your profile screen.</Text>
        <ThemeSwitchButton />
      </View>
    </View>
  );
}