import * as SecureStore from "expo-secure-store";
import {
  DEFAULT_AUTO_LOCK_TIMEOUT_MS,
  DEFAULT_PASSWORD_REAUTH_TIMEOUT_MS,
  type VaultSecurityMetadata,
} from "@/src/types/vaultSecurity";
import { fromBase64, toBase64 } from "@/src/utils/cryptoMobile";

const VAULT_KEY_PREFIX = "limis.vault.key.";
const VAULT_METADATA_PREFIX = "limis.vault.metadata.";
const VAULT_KEY_INDEX = "limis.vault.key.index";
const BIOMETRIC_SERVICE = "limis.vault.biometric-key";
const METADATA_SERVICE = "limis.vault.security-metadata";

function keyName(vaultId: string) {
  return `${VAULT_KEY_PREFIX}${vaultId}`;
}

function metadataName(vaultId: string) {
  return `${VAULT_METADATA_PREFIX}${vaultId}`;
}

const protectedOptions: SecureStore.SecureStoreOptions = {
  keychainService: BIOMETRIC_SERVICE,
  requireAuthentication: true,
  authenticationPrompt: "Unlock your vault",
  keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
};

const metadataOptions: SecureStore.SecureStoreOptions = {
  keychainService: METADATA_SERVICE,
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

async function ensureAvailable() {
  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error("Secure OS-backed storage is not available on this device.");
  }
}

async function readKeyIndex(): Promise<string[]> {
  const raw = await SecureStore.getItemAsync(VAULT_KEY_INDEX, metadataOptions);
  if (!raw) return [];

  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function writeKeyIndex(vaultIds: string[]) {
  await SecureStore.setItemAsync(VAULT_KEY_INDEX, JSON.stringify([...new Set(vaultIds)]), metadataOptions);
}

async function addToKeyIndex(vaultId: string) {
  const existing = await readKeyIndex();
  if (!existing.includes(vaultId)) {
    await writeKeyIndex([...existing, vaultId]);
  }
}

function defaultMetadata(vaultId: string): VaultSecurityMetadata {
  return {
    vaultId,
    biometricEnabled: false,
    lastPasswordUnlockAt: null,
    lastBiometricUnlockAt: null,
    passwordReauthExpiresAt: null,
    autoLockTimeoutMs: DEFAULT_AUTO_LOCK_TIMEOUT_MS,
    passwordReauthTimeoutMs: DEFAULT_PASSWORD_REAUTH_TIMEOUT_MS,
    vaultSalt: null,
    updatedAt: Date.now(),
  };
}

export async function getVaultSecurityMetadata(vaultId: string): Promise<VaultSecurityMetadata> {
  await ensureAvailable();

  const raw = await SecureStore.getItemAsync(metadataName(vaultId), metadataOptions);
  if (!raw) {
    return defaultMetadata(vaultId);
  }

  try {
    return { ...defaultMetadata(vaultId), ...JSON.parse(raw), vaultId };
  } catch {
    return defaultMetadata(vaultId);
  }
}

export async function saveVaultSecurityMetadata(metadata: VaultSecurityMetadata) {
  await ensureAvailable();
  await SecureStore.setItemAsync(
    metadataName(metadata.vaultId),
    JSON.stringify({ ...metadata, updatedAt: Date.now() }),
    metadataOptions
  );
}

export async function storeBiometricProtectedVaultKey(vaultId: string, key: Uint8Array) {
  await ensureAvailable();

  // The vault password remains the root secret. Biometrics only authorize the OS
  // to release this already-derived vault data key from Android Keystore/iOS Keychain.
  await SecureStore.setItemAsync(keyName(vaultId), toBase64(key), protectedOptions);
  await addToKeyIndex(vaultId);
}

export async function readBiometricProtectedVaultKey(vaultId: string): Promise<Uint8Array | null> {
  await ensureAvailable();

  const raw = await SecureStore.getItemAsync(keyName(vaultId), protectedOptions);
  if (!raw) {
    return null;
  }

  return fromBase64(raw);
}

export async function deleteBiometricProtectedVaultKey(vaultId: string) {
  await ensureAvailable();
  await SecureStore.deleteItemAsync(keyName(vaultId), protectedOptions);
  const remaining = (await readKeyIndex()).filter((id) => id !== vaultId);
  await writeKeyIndex(remaining);
}

export async function deleteAllBiometricProtectedVaultKeys() {
  await ensureAvailable();
  const vaultIds = await readKeyIndex();

  await Promise.all(
    vaultIds.map(async (vaultId) => {
      await SecureStore.deleteItemAsync(keyName(vaultId), protectedOptions).catch(() => {});
      await SecureStore.deleteItemAsync(metadataName(vaultId), metadataOptions).catch(() => {});
    })
  );

  await SecureStore.deleteItemAsync(VAULT_KEY_INDEX, metadataOptions);
}

export function canUseBiometricProtectedStorage() {
  return SecureStore.canUseBiometricAuthentication();
}
