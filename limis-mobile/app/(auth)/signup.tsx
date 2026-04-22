import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { clearAuthError, signupThunk } from "@/src/store/slices/authSlice";

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

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <View className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-8">
          <Text className="text-3xl font-semibold text-slate-50">Create account</Text>
          <Text className="mt-2 text-base text-slate-300">
            Sign up with your credentials to get started.
          </Text>

          <View className="mt-6 gap-4">
            <View>
              <Text className="mb-2 text-sm text-slate-300">Email</Text>
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
                placeholderTextColor="#64748b"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-slate-300">Password</Text>
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={(value) => {
                  clearErrors();
                  setPassword(value);
                }}
                placeholder="Create a password"
                placeholderTextColor="#64748b"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-slate-300">Confirm password</Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={(value) => {
                  clearErrors();
                  setConfirmPassword(value);
                }}
                placeholder="Repeat your password"
                placeholderTextColor="#64748b"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-slate-300">Vault key salt</Text>
              <TextInput
                autoCapitalize="none"
                value={vaultKeySalt}
                onChangeText={(value) => {
                  clearErrors();
                  setVaultKeySalt(value);
                }}
                placeholder="Unique vault salt"
                placeholderTextColor="#64748b"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
            </View>
          </View>

          {localError ? <Text className="mt-4 text-sm text-rose-400">{localError}</Text> : null}
          {!localError && error ? <Text className="mt-4 text-sm text-rose-400">{error}</Text> : null}

          <Pressable
            disabled={isDisabled}
            onPress={handleSignup}
            className={`mt-6 rounded-xl px-4 py-3 ${isDisabled ? "bg-slate-700" : "bg-cyan-500"}`}
          >
            <Text className="text-center text-base font-semibold text-slate-950">
              {loading ? "Creating account..." : "Sign up"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-300">Already registered? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="font-semibold text-cyan-400">Login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
