import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useUnstableNativeVariable } from "nativewind";
import { AddCredentialModal } from "@/src/components/vault/AddCredentialModal";
import { CredentialDetailModal } from "@/src/components/vault/CredentialDetailModal";
import { CredentialListSection } from "@/src/components/vault/CredentialListSection";
import { LockedVaultDetailView } from "@/src/components/vault/LockedVaultDetailView";
import { VaultDetailHeader } from "@/src/components/vault/VaultDetailHeader";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultByIdThunk, updateVaultThunk } from "@/src/store/slices/vaultSlice";
import type { CredentialFormState, VaultCredential } from "@/src/types/credential";
import { emptyCredentialForm } from "@/src/types/credential";
import { decryptVaultData, encryptVaultData } from "@/src/utils/cryptoMobile";

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
  const [newCredential, setNewCredential] = useState<CredentialFormState>(emptyCredentialForm);
  const isUnlocked = credentials !== null;
  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#111827";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  const resetNewCredential = useCallback(() => {
    setNewCredential(emptyCredentialForm);
  }, []);

  const lockVault = useCallback(() => {
    setCredentials(null);
    setSelectedCredential(null);
    setIsAddCredentialOpen(false);
    setPassword("");
    setDecrypting(false);
    setSavingCredential(false);
    resetNewCredential();
  }, [resetNewCredential]);

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

  function handleOpenAddCredential() {
    resetNewCredential();
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
        resetNewCredential();
      } else {
        Alert.alert("Save failed", typeof result.payload === "string" ? result.payload : "Could not add credential.");
      }
    } catch (err: any) {
      Alert.alert("Save failed", err?.message ?? String(err));
    } finally {
      setSavingCredential(false);
    }
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
        <VaultDetailHeader
          vault={vault}
          isUnlocked={isUnlocked}
          foregroundColor={foregroundColor}
          onBack={router.back}
          onCloseVault={handleCloseVault}
        />

        {credentials ? (
          <CredentialListSection
            credentials={credentials}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            onAddCredential={handleOpenAddCredential}
            onCloseVault={handleCloseVault}
            onSelectCredential={setSelectedCredential}
          />
        ) : (
          <LockedVaultDetailView
            password={password}
            decrypting={decrypting}
            foregroundColor={foregroundColor}
            onPasswordChange={setPassword}
            onDecrypt={handleDecrypt}
          />
        )}
      </ScrollView>

      <CredentialDetailModal
        credential={selectedCredential}
        foregroundColor={foregroundColor}
        onClose={() => setSelectedCredential(null)}
      />

      <AddCredentialModal
        visible={isAddCredentialOpen}
        value={newCredential}
        saving={savingCredential}
        foregroundColor={foregroundColor}
        onChange={setNewCredential}
        onClose={handleCloseAddCredential}
        onSave={handleAddCredential}
      />
    </View>
  );
}
