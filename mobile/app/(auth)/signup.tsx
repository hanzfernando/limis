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
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BrandMark } from "@/src/components/BrandMark";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { clearAuthError, signupThunk } from "@/src/store/slices/authSlice";
import { useUnstableNativeVariable } from "nativewind";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vaultKeySalt, setVaultKeySalt] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSignup() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !vaultKeySalt) {
      setLocalError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);

    const result = await dispatch(
      signupThunk({
        email: trimmedEmail,
        password,
        vaultKeySalt,
      })
    );

    if (signupThunk.fulfilled.match(result)) {
      router.replace("/(auth)/login");
    }
  }

  function clearErrors() {
    setLocalError(null);
    if (error) {
      dispatch(clearAuthError());
    }
  }

  const isDisabled =
    loading || !email.trim() || !password || !confirmPassword || !vaultKeySalt;
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
              Encrypted archive setup
            </Text>
            <Text className="mt-3 text-4xl font-semibold leading-tight text-[--foreground]">
              Create your guarded space.
            </Text>
            <Text className="mt-4 text-base leading-6 text-[--muted-foreground]">
              Start with a private account and a vault key salt for your personal archive.
            </Text>
          </View>

          <View className="rounded-lg border border-[--border] bg-[--card] px-5 py-6">
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
              <Ionicons name="shield-checkmark-outline" size={19} color={placeholderTextColor} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-[--foreground]">Create archive</Text>
              <Text className="mt-1 text-sm text-[--muted-foreground]">
                A calm first step into your Limis vaults.
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
                onChangeText={(value) => {
                  clearErrors();
                  setEmail(value);
                }}
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
                onChangeText={(value) => {
                  clearErrors();
                  setPassword(value);
                }}
                placeholder="Create a password"
                placeholderTextColor={placeholderTextColor}
                className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-[--muted-foreground]">Confirm password</Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={(value) => {
                  clearErrors();
                  setConfirmPassword(value);
                }}
                placeholder="Repeat your password"
                placeholderTextColor={placeholderTextColor}
                className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-[--muted-foreground]">Vault key salt</Text>
              <TextInput
                autoCapitalize="none"
                value={vaultKeySalt}
                onChangeText={(value) => {
                  clearErrors();
                  setVaultKeySalt(value);
                }}
                placeholder="Unique vault salt"
                placeholderTextColor={placeholderTextColor}
                className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
              />
            </View>
          </View>

          {localError ? (
            <Text className="mt-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
              {localError}
            </Text>
          ) : null}
          {!localError && error ? (
            <Text className="mt-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
              {error}
            </Text>
          ) : null}

          <Pressable
            disabled={isDisabled}
            onPress={handleSignup}
            className={`mt-6 h-12 flex-row items-center justify-center gap-2 rounded-md px-4 ${
              isDisabled ? "bg-[--secondary]" : "bg-[--primary]"
            }`}
          >
            <Ionicons name="archive-outline" size={18} color={isDisabled ? placeholderTextColor : "#fbf9ff"} />
            <Text className="text-center text-base font-semibold text-[--primary-foreground]">
              {loading ? "Creating..." : "Create archive"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-[--muted-foreground]">Already registered? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="font-semibold text-[--primary]">Unlock Limis</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
