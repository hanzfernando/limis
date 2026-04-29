import { Pressable, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { logoutThunk } from "@/src/store/slices/authSlice";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tokens } = useThemeSwitch();

  return (
    <View className={`flex-1 ${tokens.screenBg}`}>
      <View className="flex-1 px-6 py-8">
        <Text className={`text-3xl font-semibold ${tokens.textPrimary}`}>You are logged in</Text>
        <Text className={`mt-2 text-base ${tokens.textSecondary}`}>
          {user ? `Signed in as ${user.email}` : "No user data available."}
        </Text>

        <Pressable
          onPress={() => {
            dispatch(logoutThunk());
          }}
          className="mt-8 rounded-xl bg-rose-500 px-4 py-3"
        >
          <Text className="text-center text-base font-semibold text-rose-50">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
