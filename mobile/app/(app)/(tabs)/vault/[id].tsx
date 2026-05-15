import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, AppState, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  refreshBiometricUnlockForVault,
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
  const [editingCredential, setEditingCredential] = useState<VaultCredential | null>(null);
  const [isAddCredentialOpen, setIsAddCredentialOpen] = useState(false);
  const [isEditCredentialOpen, setIsEditCredentialOpen] = useState(false);
  const [savingCredential, setSavingCredential] = useState(false);
  const [newCredential, setNewCredential] = useState<CredentialFormState>(emptyCredentialForm);
  const [editCredential, setEditCredential] = useState<CredentialFormState>(emptyCredentialForm);
  const [securityMetadata, setSecurityMetadata] = useState<VaultSecurityMetadata | null>(null);
  const [sessionSnapshot, setSessionSnapshot] = useState<VaultSessionSnapshot | null>(null);
  const [isBiometricRefreshModalOpen, setIsBiometricRefreshModalOpen] = useState(false);
  const [isBiometricUnlockStale, setIsBiometricUnlockStale] = useState(false);
  const isUnlocked = credentials !== null;
  const foregroundColor = useUnstableNativeVariable("--foreground") ?? "#111827";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  const resetNewCredential = useCallback(() => {
    setNewCredential(emptyCredentialForm);
  }, []);

  const lockVault = useCallback(() => {
    setCredentials(null);
    setSelectedCredential(null);
    setEditingCredential(null);
    setIsAddCredentialOpen(false);
    setIsEditCredentialOpen(false);
    setPassword("");
    setDecrypting(false);
    setSavingCredential(false);
    setIsBiometricRefreshModalOpen(false);
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
      setEditingCredential(null);
      setIsAddCredentialOpen(false);
      setIsEditCredentialOpen(false);
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

      setCredentials(Array.isArray(creds) ? (creds as VaultCredential[]) : []);
      let nextMetadata = await getVaultSecurityMetadata(vault.id);
      if (nextMetadata.biometricEnabled) {
        try {
          nextMetadata = await refreshBiometricUnlockForVault(vault.id, vaultKey, vault.salt);
        } catch {
          // Password unlock should still succeed if the OS cannot update the protected biometric copy.
        }
      }
      setSecurityMetadata(nextMetadata);
      setIsBiometricUnlockStale(false);
      setPassword("");

      if (canUseBiometricUnlock() && !nextMetadata.biometricEnabled) {
        Alert.alert(
          "Enable biometric unlock?",
          "Use this phone's biometrics to unlock this vault next time. Your vault password remains the root secret.",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Enable",
              onPress: () => {
                void handleEnableBiometricUnlock();
              },
            },
          ]
        );
      }
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
      let creds: unknown;
      try {
        creds = await decryptVaultDataWithKey(vault.ciphertext, vault.iv, biometricKey);
      } catch {
        setIsBiometricUnlockStale(true);
        setIsBiometricRefreshModalOpen(true);
        setCredentials(null);
        return;
      }
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

  async function handleEnableBiometricUnlock() {
    if (!vault) return;

    const vaultKey = vaultSessionManager.getKey(vault.id);
    if (!vaultKey) {
      Alert.alert("Vault locked", "Unlock with your vault password before enabling biometric unlock.");
      return;
    }

    try {
      await enableBiometricUnlockForVault(vault.id, vaultKey, vault.salt);
      setSecurityMetadata(await getVaultSecurityMetadata(vault.id));
      Alert.alert("Biometric unlock enabled", "You can use biometrics the next time this vault is locked.");
    } catch (err: any) {
      Alert.alert("Could not enable biometric unlock", err?.message ?? String(err));
    }
  }

  function handleCloseVault() {
    lockVault();
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

  function handleOpenEditCredential(credential: VaultCredential) {
    if (vault) vaultSessionManager.recordActivity(vault.id);
    setSelectedCredential(null);
    setEditingCredential(credential);
    setEditCredential({
      title: credential.title ?? credential.name ?? "",
      username: credential.username ?? "",
      password: credential.password ?? "",
      url: credential.url ?? "",
      note: credential.note ?? "",
    });
    setIsEditCredentialOpen(true);
  }

  function handleCloseEditCredential() {
    if (savingCredential) return;
    if (vault) vaultSessionManager.recordActivity(vault.id);
    setIsEditCredentialOpen(false);
    setEditingCredential(null);
    setEditCredential(emptyCredentialForm);
  }

  async function persistCredentialList(updatedCredentials: VaultCredential[], failureTitle: string) {
    if (!vault) return false;

    const vaultKey = vaultSessionManager.getKey(vault.id);
    if (!vaultKey) {
      Alert.alert("Vault locked", "Unlock the vault again before saving changes.");
      lockVault();
      return false;
    }

    vaultSessionManager.recordActivity(vault.id);
    const encrypted = await encryptVaultDataWithKey(updatedCredentials, vaultKey);
    const payload = { ...encrypted, salt: vault.salt };
    const result = await dispatch(updateVaultThunk({ vaultId: vault.id, payload }));

    if (updateVaultThunk.fulfilled.match(result)) {
      setCredentials(updatedCredentials);
      return true;
    }

    Alert.alert(failureTitle, typeof result.payload === "string" ? result.payload : "Could not save credential changes.");
    return false;
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
      if (await persistCredentialList(updatedCredentials, "Save failed")) {
        setSelectedCredential(credential);
        setIsAddCredentialOpen(false);
        resetNewCredential();
      }
    } catch (err: any) {
      Alert.alert("Save failed", err?.message ?? String(err));
    } finally {
      setSavingCredential(false);
    }
  }

  async function handleEditCredential() {
    if (!vault || !credentials || !editingCredential) return;

    const title = editCredential.title.trim();
    if (!title) {
      Alert.alert("Title required", "Add a title for this credential.");
      return;
    }

    const updatedCredential: VaultCredential = {
      ...editingCredential,
      title,
      name: undefined,
      username: editCredential.username.trim() || undefined,
      password: editCredential.password || undefined,
      url: editCredential.url.trim() || undefined,
      note: editCredential.note.trim() || undefined,
    };

    const updatedCredentials = credentials.map((credential) =>
      credential === editingCredential || (credential.id && credential.id === editingCredential.id)
        ? updatedCredential
        : credential
    );

    setSavingCredential(true);
    try {
      if (await persistCredentialList(updatedCredentials, "Update failed")) {
        setSelectedCredential(updatedCredential);
        setEditingCredential(null);
        setIsEditCredentialOpen(false);
        setEditCredential(emptyCredentialForm);
      }
    } catch (err: any) {
      Alert.alert("Update failed", err?.message ?? String(err));
    } finally {
      setSavingCredential(false);
    }
  }

  function handleDeleteCredential(credential: VaultCredential) {
    Alert.alert(
      "Delete credential?",
      `Delete ${credential.title ?? credential.name ?? "this credential"} from the vault?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteCredential(credential);
          },
        },
      ]
    );
  }

  async function deleteCredential(credentialToDelete: VaultCredential) {
    if (!credentials) return;

    setSavingCredential(true);
    try {
      const updatedCredentials = credentials.filter(
        (credential) => credential !== credentialToDelete && (!credential.id || credential.id !== credentialToDelete.id)
      );
      if (await persistCredentialList(updatedCredentials, "Delete failed")) {
        setSelectedCredential(null);
      }
    } catch (err: any) {
      Alert.alert("Delete failed", err?.message ?? String(err));
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
            biometricEnabled={Boolean(
              securityMetadata?.biometricEnabled &&
                !isBiometricUnlockStale &&
                (!securityMetadata.vaultSalt || securityMetadata.vaultSalt === vault.salt)
            )}
            foregroundColor={foregroundColor}
            onPasswordChange={setPassword}
            onDecrypt={handleDecrypt}
            onBiometricUnlock={handleBiometricUnlock}
          />
        )}
      </ScrollView>

      <BiometricRefreshRequiredModal
        visible={isBiometricRefreshModalOpen}
        foregroundColor={foregroundColor}
        onClose={() => setIsBiometricRefreshModalOpen(false)}
      />

      <CredentialDetailModal
        credential={selectedCredential}
        foregroundColor={foregroundColor}
        onClose={() => setSelectedCredential(null)}
        onEdit={handleOpenEditCredential}
        onDelete={handleDeleteCredential}
      />

      <AddCredentialModal
        visible={isAddCredentialOpen}
        title="Add credential"
        saveLabel="Save credential"
        value={newCredential}
        saving={savingCredential}
        foregroundColor={foregroundColor}
        onChange={setNewCredential}
        onClose={handleCloseAddCredential}
        onSave={handleAddCredential}
      />

      <AddCredentialModal
        visible={isEditCredentialOpen}
        title="Edit credential"
        saveLabel="Update credential"
        value={editCredential}
        saving={savingCredential}
        foregroundColor={foregroundColor}
        onChange={setEditCredential}
        onClose={handleCloseEditCredential}
        onSave={handleEditCredential}
      />
    </View>
  );
}

type BiometricRefreshRequiredModalProps = {
  visible: boolean;
  foregroundColor: string;
  onClose: () => void;
};

function BiometricRefreshRequiredModal({
  visible,
  foregroundColor,
  onClose,
}: BiometricRefreshRequiredModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close biometric refresh message"
          className="absolute bottom-0 left-0 right-0 top-0 bg-black/45"
          onPress={onClose}
        />
        <View className="w-full max-w-md rounded-lg border border-[--border] bg-[--card] p-5">
          <View className="mb-4 flex-row items-start gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[--muted]">
              <Ionicons name="sync-outline" size={22} color={foregroundColor} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[--foreground]">Vault key needs refresh</Text>
              <Text className="mt-1 text-sm leading-5 text-[--muted-foreground]">
                This vault changed on another device or on the web. Re-enter your master password to unlock it and
                update biometric unlock on this phone.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enter master password"
            onPress={onClose}
            className="h-12 items-center justify-center rounded-md bg-[--primary]"
          >
            <Text className="font-semibold text-[--primary-foreground]">Enter master password</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
