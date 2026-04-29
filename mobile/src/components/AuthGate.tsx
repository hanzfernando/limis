import { type PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { hydrateAuthThunk } from "@/src/store/slices/authSlice";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export function AuthGate({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { token, authChecked } = useAppSelector((state) => state.auth);
  const { tokens } = useThemeSwitch();

  useEffect(() => {
    dispatch(hydrateAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (token && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [authChecked, router, segments, token]);

  if (!authChecked) {
    return (
      <View className={`flex-1 items-center justify-center ${tokens.screenBg}`}>
        <ActivityIndicator size="large" color={tokens.loadingIndicator} />
        <Text className={`mt-3 text-base ${tokens.textSecondary}`}>Restoring session...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
