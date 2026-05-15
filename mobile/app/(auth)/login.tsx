import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { BrandMark } from "@/src/components/BrandMark";
import { clearAuthError, loginThunk } from "@/src/store/slices/authSlice";
import { useUnstableNativeVariable } from "nativewind";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      return;
    }

    const result = await dispatch(loginThunk({ email: trimmedEmail, password }));

    if (loginThunk.fulfilled.match(result)) {
      console.log("Redirecting...");
      router.replace("/(app)/(tabs)/vault");
    }
  }

  function handleEmailChange(value: string) {
    if (error) {
      dispatch(clearAuthError());
    }

    setEmail(value);
  }

  function handlePasswordChange(value: string) {
    if (error) {
      dispatch(clearAuthError());
    }

    setPassword(value);
  }

  const isDisabled = loading || !email.trim() || !password;
  const placeholderTextColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  return (
    <View className="flex-1 bg-[--background]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        >
          <View className="mb-8">
            <BrandMark />
            <Text className="mt-8 text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
              Privacy-first credential manager
            </Text>
            <Text className="mt-3 text-4xl font-semibold leading-tight text-[--foreground]">
              Unlock your silent archive.
            </Text>
            <Text className="mt-4 text-base leading-6 text-[--muted-foreground]">
              Auri keeps your vaults sealed behind calm controls and zero-knowledge encryption.
            </Text>
          </View>

          <View className="rounded-lg border border-[--border] bg-[--card] px-5 py-6">
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
              <Ionicons name="lock-closed-outline" size={19} color={placeholderTextColor} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-[--foreground]">Welcome back</Text>
              <Text className="mt-1 text-sm text-[--muted-foreground]">
                Sign in to continue guarding your archive.
              </Text>
            </View>
          </View>

          <View className="mt-6 gap-4">
            <View>
              <Text className="mb-2 text-sm text-[--muted-foreground]">Email</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="you@example.com"
                placeholderTextColor={placeholderTextColor}
                className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-[--muted-foreground]">Password</Text>
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Your password"
                placeholderTextColor={placeholderTextColor}
                className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
              />
            </View>
          </View>

          {error ? (
            <Text className="mt-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
              {error}
            </Text>
          ) : null}

          <Pressable
            disabled={isDisabled}
            onPress={handleLogin}
            className={`mt-6 h-12 flex-row items-center justify-center gap-2 rounded-md px-4 ${
              isDisabled ? "bg-[--secondary]" : "bg-[--primary]"
            }`}
          >
            <Ionicons name="key-outline" size={18} color={isDisabled ? placeholderTextColor : "#fbf9ff"} />
            <Text className="text-center text-base font-semibold text-[--primary-foreground]">
              {loading ? "Unlocking..." : "Unlock Limis"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-[--muted-foreground]">No account yet? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text className="font-semibold text-[--primary]">Create archive</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
