import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { createVaultThunk } from "@/src/store/slices/vaultSlice";
import { encryptVaultData } from "@/src/utils/cryptoMobile";

export default function CreateVaultScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.vaults);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#111827";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  const isSubmitting = loading && !localError;
  const isDisabled = !name.trim() || !password || isSubmitting;

  function goBack() {
    router.back();
  }

  async function handleCreateVault() {
    const trimmedName = name.trim();
    const trimmedDesc = desc.trim();

    if (!trimmedName || !password) {
      setLocalError("Vault name and password are required.");
      return;
    }

    setLocalError(null);

    try {
      const { ciphertext, iv, salt } = await encryptVaultData([], password);
      const result = await dispatch(
        createVaultThunk({
          name: trimmedName,
          desc: trimmedDesc || undefined,
          ciphertext,
          iv,
          salt,
        })
      );

      if (createVaultThunk.fulfilled.match(result)) {
        router.replace(`/vault/${result.payload.id}`);
      } else if (createVaultThunk.rejected.match(result)) {
        setLocalError((result.payload as string | undefined) ?? "Could not create vault.");
      }
    } catch (error: any) {
      setLocalError(error?.message ?? "Unexpected error while creating vault.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-[--background]" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          className="h-10 w-10 items-center justify-center rounded-full border border-[--border] bg-[--card]"
        >
          <Ionicons name="arrow-back" size={20} color={foregroundColor} />
        </Pressable>

        <View className="flex-1">
          <Text className="text-3xl font-semibold text-[--foreground]">New Vault</Text>
          <Text className="mt-1 text-sm text-[--muted-foreground]">
            Create an encrypted vault and protect it with a password.
          </Text>
        </View>
      </View>

      <View className="rounded-3xl border border-[--border] bg-[--card] p-5">
        <View className="mb-4">
          <Text className="mb-2 text-sm text-[--muted-foreground]">Vault name</Text>
          <TextInput
            value={name}
            onChangeText={(value) => {
              setLocalError(null);
              setName(value);
            }}
            placeholder="Personal vault"
            placeholderTextColor={mutedColor}
            className="rounded-xl border border-[--input] bg-[--card] px-4 py-3 text-[--foreground]"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm text-[--muted-foreground]">Description</Text>
          <TextInput
            value={desc}
            onChangeText={(value) => {
              setLocalError(null);
              setDesc(value);
            }}
            placeholder="Optional description"
            placeholderTextColor={mutedColor}
            multiline
            textAlignVertical="top"
            className="min-h-28 rounded-xl border border-[--input] bg-[--card] px-4 py-3 text-[--foreground]"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm text-[--muted-foreground]">Vault password</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={(value) => {
              setLocalError(null);
              setPassword(value);
            }}
            placeholder="Choose a password"
            placeholderTextColor={mutedColor}
            className="rounded-xl border border-[--input] bg-[--card] px-4 py-3 text-[--foreground]"
          />
        </View>

        <Text className="text-sm text-[--muted-foreground]">
          The vault starts empty. You can add credentials after creating it.
        </Text>

        {localError ? <Text className="mt-4 text-sm text-rose-400">{localError}</Text> : null}

        <View className="mt-6 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={goBack}
            className="flex-1 items-center justify-center rounded-xl border border-[--border] px-4 py-3"
          >
            <Text className="font-semibold text-[--foreground]">Cancel</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleCreateVault}
            disabled={isDisabled}
            className={`flex-1 items-center justify-center rounded-xl px-4 py-3 ${
              isDisabled ? "bg-gray-300" : "bg-[--primary]"
            }`}
          >
            <Text className="font-semibold text-[--primary-foreground]">
              {isSubmitting ? "Creating..." : "Create vault"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}