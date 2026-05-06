import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, AppState, ScrollView, Text, View } from "react-native";
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
import type { VaultSecurityMetadata, VaultSessionSnapshot } from "@/src/types/vaultSecurity";
import {
  canUseBiometricUnlock,
  enableBiometricUnlockForVault,
  unlockVaultWithBiometrics,
} from "@/src/services/biometricUnlockService";
import { getVaultSecurityMetadata } from "@/src/services/secureVaultStorage";
import { vaultSessionManager } from "@/src/services/vaultSessionManager";
import {
  decryptVaultDataWithKey,
  deriveVaultKeyFromPassword,
  encryptVaultDataWithKey,
} from "@/src/utils/cryptoMobile";

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
  const [securityMetadata, setSecurityMetadata] = useState<VaultSecurityMetadata | null>(null);
  const [sessionSnapshot, setSessionSnapshot] = useState<VaultSessionSnapshot | null>(null);
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
    if (id) {
      vaultSessionManager.lock(id);
    }
  }, [id, resetNewCredential]);

  useEffect(() => {
    if (!id) return;
    lockVault();
    dispatch(fetchVaultByIdThunk(id));
    getVaultSecurityMetadata(id).then(setSecurityMetadata).catch(() => setSecurityMetadata(null));
  }, [dispatch, id, lockVault]);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      const unsubscribe = vaultSessionManager.subscribe(id, setSessionSnapshot);
      return () => {
        unsubscribe();
        lockVault();
      };
    }, [id, lockVault])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active" && id) {
        vaultSessionManager.lock(id);
      }
    });

    return () => subscription.remove();
  }, [id]);

  useEffect(() => {
    if (sessionSnapshot?.lockState === "locked" && credentials) {
      setCredentials(null);
      setSelectedCredential(null);
      setIsAddCredentialOpen(false);
      setPassword("");
    }
  }, [credentials, sessionSnapshot?.lockState]);

  async function handleDecrypt() {
    if (!vault) return;
    setDecrypting(true);
    let vaultKey: Uint8Array | null = null;
    try {
      vaultKey = await deriveVaultKeyFromPassword(password, vault.salt);
      const creds = await decryptVaultDataWithKey(vault.ciphertext, vault.iv, vaultKey);
      await vaultSessionManager.unlockWithVaultKey(vault.id, vaultKey, "password", securityMetadata ?? undefined);

      if (canUseBiometricUnlock()) {
        await enableBiometricUnlockForVault(vault.id, vaultKey).catch(() => {});
      }

      setCredentials(Array.isArray(creds) ? (creds as VaultCredential[]) : []);
      setSecurityMetadata(await getVaultSecurityMetadata(vault.id));
      setPassword("");
    } catch (err: any) {
      Alert.alert("Decryption failed", err?.message ?? String(err));
      setCredentials(null);
    } finally {
      vaultKey?.fill(0);
      setDecrypting(false);
    }
  }

  async function handleBiometricUnlock() {
    if (!vault) return;
    setDecrypting(true);
    let biometricKey: Uint8Array | null = null;
    try {
      const { key, metadata } = await unlockVaultWithBiometrics(vault.id);
      biometricKey = key;
      const creds = await decryptVaultDataWithKey(vault.ciphertext, vault.iv, biometricKey);
      await vaultSessionManager.unlockWithVaultKey(vault.id, biometricKey, "biometric", metadata);
      setCredentials(Array.isArray(creds) ? (creds as VaultCredential[]) : []);
      setSecurityMetadata(await getVaultSecurityMetadata(vault.id));
    } catch (err: any) {
      Alert.alert("Unlock failed", err?.message ?? String(err));
      setCredentials(null);
    } finally {
      biometricKey?.fill(0);
      setDecrypting(false);
    }
  }

  function handleCloseVault() {
    lockVault();
    router.back();
  }

  function handleOpenAddCredential() {
    if (vault) vaultSessionManager.recordActivity(vault.id);
    resetNewCredential();
    setIsAddCredentialOpen(true);
  }

  function handleCloseAddCredential() {
    if (savingCredential) return;
    if (vault) vaultSessionManager.recordActivity(vault.id);
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
    const vaultKey = vaultSessionManager.getKey(vault.id);

    if (!vaultKey) {
      Alert.alert("Vault locked", "Unlock the vault again before saving changes.");
      lockVault();
      return;
    }

    setSavingCredential(true);
    try {
      vaultSessionManager.recordActivity(vault.id);
      const encrypted = await encryptVaultDataWithKey(updatedCredentials, vaultKey);
      const payload = { ...encrypted, salt: vault.salt };
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
      <ScrollView
        className="flex-1 p-4"
        onScrollBeginDrag={() => {
          if (vault && isUnlocked) vaultSessionManager.recordActivity(vault.id);
        }}
        onTouchStart={() => {
          if (vault && isUnlocked) vaultSessionManager.recordActivity(vault.id);
        }}
      >
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
            biometricAvailable={canUseBiometricUnlock()}
            biometricEnabled={Boolean(securityMetadata?.biometricEnabled)}
            foregroundColor={foregroundColor}
            onPasswordChange={setPassword}
            onDecrypt={handleDecrypt}
            onBiometricUnlock={handleBiometricUnlock}
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
