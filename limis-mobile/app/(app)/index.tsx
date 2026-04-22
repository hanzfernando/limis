import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { logoutThunk } from "@/src/store/slices/authSlice";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-semibold text-slate-50">You are logged in</Text>
        <Text className="mt-2 text-base text-slate-300">
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
    </SafeAreaView>
  );
}
