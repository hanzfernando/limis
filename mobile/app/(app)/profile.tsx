import { View, Text } from "react-native";
import ThemeSwitchButton from "@/src/components/ThemeSwitchButton";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-[--background]">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-semibold text-[--foreground]">Profile</Text>
        <Text className="mt-2 text-base text-[--muted-foreground]">
          This is your profile screen.
        </Text>
        <ThemeSwitchButton />
      </View>
    </View>
  );
}