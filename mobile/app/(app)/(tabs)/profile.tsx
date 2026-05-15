import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnstableNativeVariable } from "nativewind";
import { BrandMark } from "@/src/components/BrandMark";
import ThemeSwitchButton from "@/src/components/ThemeSwitchButton";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { changePasswordRequest } from "@/src/services/userService";
import { logoutThunk } from "@/src/store/slices/authSlice";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#181424";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await changePasswordRequest({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      Alert.alert("Password changed", "Unlock Limis again with your new password.");
      dispatch(logoutThunk());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSubmitting(false);
    }
  }

  function clearFormError() {
    if (error) setError(null);
  }

  return (
    <View className="flex-1 bg-[--background]">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 118 }}>
        <View className="mb-7">
          <BrandMark />
        </View>

        <View className="rounded-lg border border-[--border] bg-[--card] p-5">
          <View className="mb-3 h-11 w-11 items-center justify-center rounded-lg bg-[--secondary]">
            <Ionicons name="shield-checkmark-outline" size={21} color={primaryColor} />
          </View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
            Account archive
          </Text>
          <Text className="mt-2 text-3xl font-semibold text-[--foreground]">Profile security</Text>
          <Text className="mt-3 text-sm leading-6 text-[--muted-foreground]">
            Rotate your access key and keep Limis quiet, private, and guarded.
          </Text>
        </View>

        <View className="mt-4 rounded-lg border border-[--border] bg-[--card] p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
              <Ionicons name="mail-outline" size={18} color={primaryColor} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[--foreground]">Signed in</Text>
              <Text className="mt-1 text-sm text-[--muted-foreground]">{user?.email ?? "Limis account"}</Text>
            </View>
            <ThemeSwitchButton compact />
          </View>
        </View>

        <View className="mt-4 rounded-lg border border-[--border] bg-[--card] p-5">
          <View className="mb-5 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
              <Ionicons name="key-outline" size={18} color={primaryColor} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[--foreground]">Change password</Text>
              <Text className="mt-1 text-sm text-[--muted-foreground]">
                You will sign in again after rotation.
              </Text>
            </View>
          </View>

          <PasswordInput
            label="Current password"
            value={currentPassword}
            placeholder="Current password"
            placeholderTextColor={mutedColor}
            onChangeText={(value) => {
              clearFormError();
              setCurrentPassword(value);
            }}
          />
          <PasswordInput
            label="New password"
            value={newPassword}
            placeholder="New password"
            placeholderTextColor={mutedColor}
            onChangeText={(value) => {
              clearFormError();
              setNewPassword(value);
            }}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmNewPassword}
            placeholder="Confirm new password"
            placeholderTextColor={mutedColor}
            onChangeText={(value) => {
              clearFormError();
              setConfirmNewPassword(value);
            }}
          />

          {error ? (
            <Text className="mb-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
              {error}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleChangePassword}
            disabled={submitting}
            className={`h-12 flex-row items-center justify-center gap-2 rounded-md ${
              submitting ? "bg-[--secondary]" : "bg-[--primary]"
            }`}
          >
            <Ionicons name="key-outline" size={17} color={submitting ? mutedColor : "#fbf9ff"} />
            <Text className="font-semibold text-[--primary-foreground]">
              {submitting ? "Changing..." : "Change password"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-lg border border-[--border] bg-[--card] p-4">
          <Pressable
            accessibilityRole="button"
            onPress={() => dispatch(logoutThunk())}
            className="h-12 flex-row items-center justify-center gap-2 rounded-md border border-[--destructive]"
          >
            <Ionicons name="log-out-outline" size={18} color={foregroundColor} />
            <Text className="font-semibold text-[--foreground]">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  placeholder: string;
  placeholderTextColor: string;
  onChangeText: (value: string) => void;
};

function PasswordInput({
  label,
  value,
  placeholder,
  placeholderTextColor,
  onChangeText,
}: PasswordInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-[--muted-foreground]">{label}</Text>
      <TextInput
        secureTextEntry
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
      />
    </View>
  );
}
