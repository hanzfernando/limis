import type { VaultUnlockResult } from "@/src/types/vaultSecurity";
import {
  canUseBiometricProtectedStorage,
  getVaultSecurityMetadata,
  readBiometricProtectedVaultKey,
  saveVaultSecurityMetadata,
  storeBiometricProtectedVaultKey,
} from "@/src/services/secureVaultStorage";

export function canUseBiometricUnlock() {
  return canUseBiometricProtectedStorage();
}

export async function enableBiometricUnlockForVault(vaultId: string, vaultKey: Uint8Array, vaultSalt?: string) {
  if (!canUseBiometricUnlock()) {
    throw new Error("Biometric authentication is not available or is not strong enough on this device.");
  }

  await storeBiometricProtectedVaultKey(vaultId, vaultKey);
  const metadata = await getVaultSecurityMetadata(vaultId);
  await saveVaultSecurityMetadata({
    ...metadata,
    biometricEnabled: true,
    vaultSalt: vaultSalt ?? metadata.vaultSalt,
    updatedAt: Date.now(),
  });
}

export async function refreshBiometricUnlockForVault(vaultId: string, vaultKey: Uint8Array, vaultSalt: string) {
  const metadata = await getVaultSecurityMetadata(vaultId);

  if (!metadata.biometricEnabled) {
    return metadata;
  }

  if (!canUseBiometricUnlock()) {
    throw new Error("Biometric authentication is not available or is not strong enough on this device.");
  }

  await storeBiometricProtectedVaultKey(vaultId, vaultKey);
  const updatedMetadata = {
    ...metadata,
    biometricEnabled: true,
    vaultSalt,
    updatedAt: Date.now(),
  };

  await saveVaultSecurityMetadata(updatedMetadata);
  return updatedMetadata;
}

export async function unlockVaultWithBiometrics(vaultId: string): Promise<VaultUnlockResult> {
  const metadata = await getVaultSecurityMetadata(vaultId);

  if (!metadata.biometricEnabled) {
    throw new Error("Biometric unlock is not enabled for this vault.");
  }

  if (metadata.passwordReauthExpiresAt && Date.now() >= metadata.passwordReauthExpiresAt) {
    throw new Error("Vault password re-verification is required.");
  }

  const key = await readBiometricProtectedVaultKey(vaultId);
  if (!key) {
    await saveVaultSecurityMetadata({
      ...metadata,
      biometricEnabled: false,
      updatedAt: Date.now(),
    });
    throw new Error("Biometric unlock was reset. Enter your vault password again.");
  }

  const updatedMetadata = {
    ...metadata,
    lastBiometricUnlockAt: Date.now(),
    updatedAt: Date.now(),
  };

  await saveVaultSecurityMetadata(updatedMetadata);
  return { key, metadata: updatedMetadata };
}
