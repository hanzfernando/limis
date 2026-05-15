import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";
import { BrandMark } from "@/src/components/BrandMark";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { vaultSessionManager } from "@/src/services/vaultSessionManager";
import { createVaultThunk } from "@/src/store/slices/vaultSlice";
import {
  deriveKeyFromPassword,
  encryptVaultDataWithKey,
  generateSalt,
  toBase64,
} from "@/src/utils/cryptoMobile";

export default function CreateVaultScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.vaults);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#181424";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

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

    let vaultKey: Uint8Array | null = null;
    try {
      const saltBytes = generateSalt();
      vaultKey = await deriveKeyFromPassword(password, saltBytes);
      const { ciphertext, iv } = await encryptVaultDataWithKey([], vaultKey);
      const salt = toBase64(saltBytes);
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
        await vaultSessionManager.unlockWithVaultKey(result.payload.id, vaultKey, "password");
        router.replace(`/vault/${result.payload.id}`);
      } else if (createVaultThunk.rejected.match(result)) {
        setLocalError((result.payload as string | undefined) ?? "Could not create vault.");
      }
    } catch (error: any) {
      setLocalError(error?.message ?? "Unexpected error while creating vault.");
    } finally {
      vaultKey?.fill(0);
    }
  }

  return (
    <ScrollView className="flex-1 bg-[--background]" contentContainerStyle={{ padding: 20, paddingBottom: 44 }}>
      <View className="mb-7 flex-row items-center justify-between">
        <BrandMark compact />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          className="h-10 w-10 items-center justify-center rounded-md border border-[--border] bg-[--card]"
        >
          <Ionicons name="arrow-back" size={20} color={foregroundColor} />
        </Pressable>
      </View>

      <View className="mb-5 rounded-lg border border-[--border] bg-[--card] p-5">
        <View className="mb-3 h-11 w-11 items-center justify-center rounded-lg bg-[--secondary]">
          <Ionicons name="archive-outline" size={21} color={primaryColor} />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
            Encrypted archive
          </Text>
          <Text className="mt-2 text-3xl font-semibold text-[--foreground]">New vault</Text>
          <Text className="mt-3 text-sm leading-6 text-[--muted-foreground]">
            Create a sealed space for credentials, recovery records, and private notes.
          </Text>
        </View>
      </View>

      <View className="rounded-lg border border-[--border] bg-[--card] p-5">
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
            className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
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
            className="min-h-28 rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
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
            className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
          />
        </View>

        <View className="rounded-md border border-[--border] bg-[--background] p-3">
          <View className="flex-row items-start gap-2">
            <Ionicons name="shield-checkmark-outline" size={17} color={primaryColor} />
            <Text className="flex-1 text-sm leading-5 text-[--muted-foreground]">
          The vault starts empty. You can add credentials after creating it.
            </Text>
          </View>
        </View>

        {localError ? (
          <Text className="mt-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
            {localError}
          </Text>
        ) : null}

        <View className="mt-6 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={goBack}
            className="h-12 flex-1 items-center justify-center rounded-md border border-[--border] px-4"
          >
            <Text className="font-semibold text-[--foreground]">Cancel</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleCreateVault}
            disabled={isDisabled}
            className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md px-4 ${
              isDisabled ? "bg-[--secondary]" : "bg-[--primary]"
            }`}
          >
            <Ionicons name="lock-closed-outline" size={17} color={isDisabled ? mutedColor : "#fbf9ff"} />
            <Text className="font-semibold text-[--primary-foreground]">
              {isSubmitting ? "Creating..." : "Create vault"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
