export type VaultLockState = "locked" | "unlocked" | "loggedOut";

export type SensitiveAction =
  | "vaultExport"
  | "changeMasterPassword"
  | "disableSecuritySettings";

export interface VaultSecurityMetadata {
  vaultId: string;
  biometricEnabled: boolean;
  lastPasswordUnlockAt: number | null;
  lastBiometricUnlockAt: number | null;
  passwordReauthExpiresAt: number | null;
  autoLockTimeoutMs: number;
  passwordReauthTimeoutMs: number;
  updatedAt: number;
}

export interface VaultUnlockResult {
  key: Uint8Array;
  metadata: VaultSecurityMetadata;
}

export interface VaultSessionSnapshot {
  vaultId: string;
  lockState: VaultLockState;
  hasKeyInMemory: boolean;
  lastActivityAt: number | null;
  passwordReauthExpiresAt: number | null;
}

export interface VaultSessionListener {
  (snapshot: VaultSessionSnapshot): void;
}

export const DEFAULT_AUTO_LOCK_TIMEOUT_MS = 5 * 60 * 1000;
export const DEFAULT_PASSWORD_REAUTH_TIMEOUT_MS = 24 * 60 * 60 * 1000;
