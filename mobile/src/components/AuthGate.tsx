import { type PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { hydrateAuthThunk } from "@/src/store/slices/authSlice";
import { useUnstableNativeVariable } from "nativewind";

export function AuthGate({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { token, authChecked } = useAppSelector((state) => state.auth);
  const indicatorColor = useUnstableNativeVariable("--foreground") ?? "#111827";

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
      <View className="flex-1 items-center justify-center bg-[--background]">
        <ActivityIndicator size="large" color={indicatorColor} />
        <Text className="mt-3 text-base text-[--muted-foreground]">
          Restoring session...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
