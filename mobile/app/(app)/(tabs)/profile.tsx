import { View, Text } from "react-native";
import ThemeSwitchButton from "@/src/components/ThemeSwitchButton";
import { useAppDispatch } from "@/src/hooks/redux";
import { logoutThunk } from "@/src/store/slices/authSlice";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  return (
    <View className="flex-1 bg-[--background]">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-semibold text-[--foreground]">Profile</Text>
        <Text className="mt-2 text-base text-[--muted-foreground]">
          This is your profile screen.
        </Text>
        <ThemeSwitchButton />

        <View className="mt-6 rounded-2xl border border-[--border] bg-[--card] p-4">
          <Text className="text-base font-semibold text-[--foreground]">Account</Text>
          <Text className="mt-1 text-sm text-[--muted-foreground]">
            Manage your account settings.
          </Text>
          <View className="mt-4 rounded-xl bg-[--primary] px-4 py-3">
            <Text
              onPress={() => dispatch(logoutThunk())}
              className="text-center font-semibold text-[--primary-foreground]"
            >
              Logout
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
