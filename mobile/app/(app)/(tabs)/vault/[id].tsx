import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useUnstableNativeVariable } from "nativewind";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultByIdThunk, updateVaultThunk } from "@/src/store/slices/vaultSlice";
import { decryptVaultData, encryptVaultData } from "@/src/utils/cryptoMobile";

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
  const [isAddCredentialOpen, setIsAddCredentialOpen] = useState(false);
  const [savingCredential, setSavingCredential] = useState(false);
  const [newCredential, setNewCredential] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    note: "",
  });
  const isUnlocked = credentials !== null;
  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#111827";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  const lockVault = useCallback(() => {
    setCredentials(null);
    setSelectedCredential(null);
    setIsAddCredentialOpen(false);
    setPassword("");
    setDecrypting(false);
    setSavingCredential(false);
    setNewCredential({ title: "", username: "", password: "", url: "", note: "" });
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

  function handleOpenAddCredential() {
    setNewCredential({ title: "", username: "", password: "", url: "", note: "" });
    setIsAddCredentialOpen(true);
  }

  function handleCloseAddCredential() {
    if (savingCredential) return;
    setIsAddCredentialOpen(false);
  }

  async function handleAddCredential() {
    if (!vault || !credentials) return;

    const title = newCredential.title.trim();
    if (!title) {
      Alert.alert("Title required", "Add a title for this credential.");
      return;
    }

    const credential: VaultCredential = {
      id: `${Date.now()}`,
      title,
      username: newCredential.username.trim() || undefined,
      password: newCredential.password || undefined,
      url: newCredential.url.trim() || undefined,
      note: newCredential.note.trim() || undefined,
    };
    const updatedCredentials = [...credentials, credential];

    setSavingCredential(true);
    try {
      const payload = await encryptVaultData(updatedCredentials, password);
      const result = await dispatch(updateVaultThunk({ vaultId: vault.id, payload }));

      if (updateVaultThunk.fulfilled.match(result)) {
        setCredentials(updatedCredentials);
        setSelectedCredential(credential);
        setIsAddCredentialOpen(false);
      } else {
        Alert.alert("Save failed", typeof result.payload === "string" ? result.payload : "Could not add credential.");
      }
    } catch (err: any) {
      Alert.alert("Save failed", err?.message ?? String(err));
    } finally {
      setSavingCredential(false);
    }
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
              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add credential"
                  onPress={handleOpenAddCredential}
                  className="flex-row items-center gap-2 rounded-md bg-[--primary] px-3 py-2"
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                  <Text className="text-sm font-semibold text-[--primary-foreground]">Add</Text>
                </Pressable>
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

      <Modal
        animationType="slide"
        transparent
        visible={isAddCredentialOpen}
        onRequestClose={handleCloseAddCredential}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close add credential"
            className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
            onPress={handleCloseAddCredential}
          />
          <View className="max-h-[90%] rounded-t-2xl bg-[--card] p-4">
            <View className="mb-4 flex-row items-center justify-between gap-3">
              <Text className="text-lg font-semibold text-[--foreground]">Add credential</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close add credential"
                onPress={handleCloseAddCredential}
                className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
              >
                <Ionicons name="close" size={20} color={foregroundColor} />
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" className="mb-12">
              <View className="mb-4">
                <Text className="mb-2 text-sm text-[--muted-foreground]">Title</Text>
                <TextInput
                  value={newCredential.title}
                  onChangeText={(value) => setNewCredential((current) => ({ ...current, title: value }))}
                  placeholder="Example account"
                  className="rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm text-[--muted-foreground]">Username</Text>
                <TextInput
                  value={newCredential.username}
                  onChangeText={(value) => setNewCredential((current) => ({ ...current, username: value }))}
                  autoCapitalize="none"
                  placeholder="name@example.com"
                  className="rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm text-[--muted-foreground]">Password</Text>
                <TextInput
                  value={newCredential.password}
                  onChangeText={(value) => setNewCredential((current) => ({ ...current, password: value }))}
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Password"
                  className="rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm text-[--muted-foreground]">URL</Text>
                <TextInput
                  value={newCredential.url}
                  onChangeText={(value) => setNewCredential((current) => ({ ...current, url: value }))}
                  autoCapitalize="none"
                  keyboardType="url"
                  placeholder="https://example.com"
                  className="rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm text-[--muted-foreground]">Note</Text>
                <TextInput
                  value={newCredential.note}
                  onChangeText={(value) => setNewCredential((current) => ({ ...current, note: value }))}
                  multiline
                  textAlignVertical="top"
                  placeholder="Optional note"
                  className="min-h-24 rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
                />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleAddCredential}
                disabled={savingCredential}
                className={`mb-6 h-12 items-center justify-center rounded-md ${
                  savingCredential ? "bg-gray-300" : "bg-[--primary]"
                }`}
              >
                <Text className="font-semibold text-[--primary-foreground]">
                  {savingCredential ? "Saving..." : "Save credential"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
