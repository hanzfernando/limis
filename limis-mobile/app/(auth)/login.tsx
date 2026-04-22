import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { clearAuthError, loginThunk } from "@/src/store/slices/authSlice";

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
    console.log("Login thunk result:", result);
    console.log("Login result:", result.type); // should print "auth/login/fulfilled"

    if (loginThunk.fulfilled.match(result)) {
      console.log("Redirecting...");
      router.replace("/(app)");
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

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <View className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-8">
          <Text className="text-3xl font-semibold text-slate-50">Welcome back</Text>
          <Text className="mt-2 text-base text-slate-300">
            Sign in with your account to continue.
          </Text>

          <View className="mt-6 gap-4">
            <View>
              <Text className="mb-2 text-sm text-slate-300">Email</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={handleEmailChange}
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
                onChangeText={handlePasswordChange}
                placeholder="Your password"
                placeholderTextColor="#64748b"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
            </View>
          </View>

          {error ? <Text className="mt-4 text-sm text-rose-400">{error}</Text> : null}

          <Pressable
            disabled={isDisabled}
            onPress={handleLogin}
            className={`mt-6 rounded-xl px-4 py-3 ${isDisabled ? "bg-slate-700" : "bg-cyan-500"}`}
          >
            <Text className="text-center text-base font-semibold text-slate-950">
              {loading ? "Signing in..." : "Login"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-300">No account yet? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text className="font-semibold text-cyan-400">Create one</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
