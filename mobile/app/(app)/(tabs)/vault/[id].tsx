import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useUnstableNativeVariable } from "nativewind";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultByIdThunk } from "@/src/store/slices/vaultSlice";
import { decryptVaultData } from "@/src/utils/cryptoMobile";

type VaultCredential = {
  id?: string;
  title?: string;
  name?: string;
  username?: string;
  password?: string;
  url?: string;
  note?: string;
};

export default function VaultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selected: vault, loading } = useAppSelector((s) => s.vaults);
  const [password, setPassword] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [credentials, setCredentials] = useState<VaultCredential[] | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<VaultCredential | null>(null);
  const isUnlocked = credentials !== null;
  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#111827";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  const lockVault = useCallback(() => {
    setCredentials(null);
    setSelectedCredential(null);
    setPassword("");
    setDecrypting(false);
  }, []);

  useEffect(() => {
    if (!id) return;
    lockVault();
    dispatch(fetchVaultByIdThunk(id));
  }, [dispatch, id, lockVault]);

  useFocusEffect(
    useCallback(() => {
      return lockVault;
    }, [lockVault])
  );

  async function handleDecrypt() {
    if (!vault) return;
    setDecrypting(true);
    try {
      const creds = await decryptVaultData(vault.ciphertext, vault.iv, vault.salt, password);
      setCredentials(Array.isArray(creds) ? (creds as VaultCredential[]) : []);
    } catch (err: any) {
      Alert.alert("Decryption failed", err?.message ?? String(err));
      setCredentials(null);
    } finally {
      setDecrypting(false);
    }
  }

  function handleCloseVault() {
    lockVault();
    router.back();
  }

  function handleSelectCredential(credential: VaultCredential) {
    setSelectedCredential(credential);
  }

  function handleDismissCredential() {
    setSelectedCredential(null);
  }

  function renderCredentialField(label: string, value: string | undefined) {
    if (!value) return null;

    return (
      <View className="mb-4">
        <Text className="mb-2 text-sm text-[--muted-foreground]">{label}</Text>
        <View className="rounded-lg border border-[--border] bg-[--muted] p-3">
          <Text selectable className="text-sm text-[--foreground]">
            {value}
          </Text>
        </View>
      </View>
    );
  }

  if (loading && !vault) {
    return (
      <View className="flex-1 items-center justify-center bg-[--background]">
        <ActivityIndicator size="large" color="#111827" />
        <Text className="mt-2 text-[--muted-foreground]">Loading vault...</Text>
      </View>
    );
  }

  if (!vault) {
    return (
      <View className="flex-1 items-center justify-center bg-[--background] p-4">
        <Text className="text-base text-[--foreground]">Vault not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[--background]">
      <ScrollView className="flex-1 p-4">
        <View className="mb-4 flex-row items-start justify-between gap-3 rounded-lg bg-[--card] p-4">
          <View className="flex-1">
            <Text className="text-xl font-semibold text-[--foreground]">{vault.name}</Text>
            {vault.desc ? <Text className="mt-1 text-sm text-[--muted-foreground]">{vault.desc}</Text> : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUnlocked ? "Close vault" : "Go back"}
            onPress={isUnlocked ? handleCloseVault : router.back}
            className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
          >
            <Ionicons name={isUnlocked ? "lock-closed-outline" : "arrow-back"} size={20} color={foregroundColor} />
          </Pressable>
        </View>

        {!isUnlocked ? (
          <View>
            <View className="mb-4 items-center rounded-lg border border-[--border] bg-[--card] p-6">
              <Ionicons name="lock-closed-outline" size={28} color={foregroundColor} />
              <Text className="mt-3 text-lg font-semibold text-[--foreground]">This vault is locked.</Text>
              <Text className="mt-1 text-center text-sm text-[--muted-foreground]">
                Enter your vault password to unlock it on this screen.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-[--muted-foreground]">Vault password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter password"
                className="mt-2 rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleDecrypt}
              disabled={decrypting || !password}
              className={`h-12 items-center justify-center rounded-md ${
                decrypting || !password ? "bg-gray-300" : "bg-gray-900"
              }`}
            >
              <Text className="font-semibold text-white">{decrypting ? "Decrypting..." : "Unlock Vault"}</Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-[--foreground]">Credentials</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close vault"
                onPress={handleCloseVault}
                className="flex-row items-center gap-2 rounded-md border border-[--border] px-3 py-2"
              >
                <Ionicons name="lock-closed-outline" size={16} color={foregroundColor} />
                <Text className="text-sm font-semibold text-[--foreground]">Close</Text>
              </Pressable>
            </View>

            {credentials.length === 0 ? (
              <Text className="text-sm text-[--muted-foreground]">No credentials found.</Text>
            ) : (
              credentials.map((credential, idx) => (
                <Pressable
                  key={credential.id ?? idx}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${credential.title ?? credential.name ?? `credential ${idx + 1}`}`}
                  onPress={() => handleSelectCredential(credential)}
                  className="mb-3 rounded-lg border border-[--border] bg-[--card] p-3"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-[--foreground]">
                        {credential.title ?? credential.name ?? `Item ${idx + 1}`}
                      </Text>
                      {credential.username ? (
                        <Text className="mt-1 text-sm text-[--muted-foreground]">{credential.username}</Text>
                      ) : null}
                      {credential.url ? (
                        <Text className="mt-1 text-xs text-[--muted-foreground]">{credential.url}</Text>
                      ) : null}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={mutedColor} />
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={selectedCredential !== null}
        onRequestClose={handleDismissCredential}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close credential details"
            className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
            onPress={handleDismissCredential}
          />
          <View className="max-h-[82%] rounded-t-2xl bg-[--card] p-4">
            <View className="mb-4 flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[--foreground]">
                  {selectedCredential?.title ?? selectedCredential?.name ?? "Credential"}
                </Text>
                {selectedCredential?.id ? (
                  <Text className="mt-1 text-xs text-[--muted-foreground]">{selectedCredential.id}</Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close credential details"
                onPress={handleDismissCredential}
                className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
              >
                <Ionicons name="close" size={20} color={foregroundColor} />
              </Pressable>
            </View>

            <ScrollView className="pb-12">
              {renderCredentialField("Username", selectedCredential?.username)}
              {renderCredentialField("Password", selectedCredential?.password)}
              {renderCredentialField("URL", selectedCredential?.url)}
              {renderCredentialField("Note", selectedCredential?.note)}

              {selectedCredential &&
              !selectedCredential.username &&
              !selectedCredential.password &&
              !selectedCredential.url &&
              !selectedCredential.note ? (
                <Text className="mb-4 text-sm text-[--muted-foreground]">This credential has no saved details.</Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
