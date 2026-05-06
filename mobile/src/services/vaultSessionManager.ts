import type {
  SensitiveAction,
  VaultSecurityMetadata,
  VaultSessionListener,
  VaultSessionSnapshot,
} from "@/src/types/vaultSecurity";
import {
  DEFAULT_AUTO_LOCK_TIMEOUT_MS,
  DEFAULT_PASSWORD_REAUTH_TIMEOUT_MS,
} from "@/src/types/vaultSecurity";
import {
  deleteAllBiometricProtectedVaultKeys,
  deleteBiometricProtectedVaultKey,
  getVaultSecurityMetadata,
  saveVaultSecurityMetadata,
} from "@/src/services/secureVaultStorage";

type SessionEntry = {
  key: Uint8Array | null;
  lockState: "locked" | "unlocked" | "loggedOut";
  lastActivityAt: number | null;
  passwordReauthExpiresAt: number | null;
  autoLockTimeoutMs: number;
  timer: ReturnType<typeof setTimeout> | null;
  listeners: Set<VaultSessionListener>;
};

class VaultSessionManager {
  private sessions = new Map<string, SessionEntry>();

  subscribe(vaultId: string, listener: VaultSessionListener) {
    const session = this.getSession(vaultId);
    session.listeners.add(listener);
    listener(this.snapshot(vaultId, session));

    return () => {
      session.listeners.delete(listener);
    };
  }

  getKey(vaultId: string) {
    return this.getSession(vaultId).key;
  }

  async unlockWithVaultKey(
    vaultId: string,
    key: Uint8Array,
    source: "password" | "biometric",
    metadata?: VaultSecurityMetadata
  ) {
    const currentMetadata = metadata ?? (await getVaultSecurityMetadata(vaultId));
    const now = Date.now();
    const passwordReauthExpiresAt =
      source === "password"
        ? now + (currentMetadata.passwordReauthTimeoutMs || DEFAULT_PASSWORD_REAUTH_TIMEOUT_MS)
        : currentMetadata.passwordReauthExpiresAt;

    const nextMetadata: VaultSecurityMetadata = {
      ...currentMetadata,
      lastPasswordUnlockAt: source === "password" ? now : currentMetadata.lastPasswordUnlockAt,
      lastBiometricUnlockAt: source === "biometric" ? now : currentMetadata.lastBiometricUnlockAt,
      passwordReauthExpiresAt,
      updatedAt: now,
    };

    await saveVaultSecurityMetadata(nextMetadata);

    const session = this.getSession(vaultId);
    this.wipeKey(session);
    session.key = new Uint8Array(key);
    session.lockState = "unlocked";
    session.lastActivityAt = now;
    session.passwordReauthExpiresAt = passwordReauthExpiresAt;
    session.autoLockTimeoutMs = nextMetadata.autoLockTimeoutMs || DEFAULT_AUTO_LOCK_TIMEOUT_MS;
    this.scheduleAutoLock(vaultId, session.autoLockTimeoutMs);
    this.notify(vaultId);
  }

  recordActivity(vaultId: string) {
    const session = this.getSession(vaultId);
    if (session.lockState !== "unlocked") return;

    session.lastActivityAt = Date.now();
    this.scheduleAutoLock(vaultId, session.autoLockTimeoutMs);
    this.notify(vaultId);
  }

  lock(vaultId: string) {
    const session = this.getSession(vaultId);
    this.wipeKey(session);
    session.lockState = "locked";
    session.lastActivityAt = null;
    this.clearTimer(session);
    this.notify(vaultId);
  }

  async logoutVault(vaultId: string) {
    const session = this.getSession(vaultId);
    this.wipeKey(session);
    session.lockState = "loggedOut";
    session.lastActivityAt = null;
    session.passwordReauthExpiresAt = null;
    this.clearTimer(session);
    await deleteBiometricProtectedVaultKey(vaultId);
    const metadata = await getVaultSecurityMetadata(vaultId);
    await saveVaultSecurityMetadata({
      ...metadata,
      biometricEnabled: false,
      passwordReauthExpiresAt: null,
      updatedAt: Date.now(),
    });
    this.notify(vaultId);
  }

  async logoutAll() {
    for (const [vaultId, session] of this.sessions.entries()) {
      this.wipeKey(session);
      session.lockState = "loggedOut";
      session.lastActivityAt = null;
      session.passwordReauthExpiresAt = null;
      this.clearTimer(session);
      this.notify(vaultId);
    }

    await deleteAllBiometricProtectedVaultKeys();
  }

  async requiresPasswordForSensitiveAction(vaultId: string, _action: SensitiveAction) {
    const metadata = await getVaultSecurityMetadata(vaultId);
    return !metadata.lastPasswordUnlockAt || !metadata.passwordReauthExpiresAt || Date.now() >= metadata.passwordReauthExpiresAt;
  }

  private getSession(vaultId: string): SessionEntry {
    const existing = this.sessions.get(vaultId);
    if (existing) return existing;

    const session: SessionEntry = {
      key: null,
      lockState: "locked",
      lastActivityAt: null,
      passwordReauthExpiresAt: null,
      autoLockTimeoutMs: DEFAULT_AUTO_LOCK_TIMEOUT_MS,
      timer: null,
      listeners: new Set(),
    };
    this.sessions.set(vaultId, session);
    return session;
  }

  private scheduleAutoLock(vaultId: string, timeoutMs: number) {
    const session = this.getSession(vaultId);
    this.clearTimer(session);
    session.timer = setTimeout(() => this.lock(vaultId), timeoutMs);
  }

  private clearTimer(session: SessionEntry) {
    if (session.timer) {
      clearTimeout(session.timer);
      session.timer = null;
    }
  }

  private wipeKey(session: SessionEntry) {
    if (session.key) {
      session.key.fill(0);
      session.key = null;
    }
  }

  private snapshot(vaultId: string, session: SessionEntry): VaultSessionSnapshot {
    return {
      vaultId,
      lockState: session.lockState,
      hasKeyInMemory: Boolean(session.key),
      lastActivityAt: session.lastActivityAt,
      passwordReauthExpiresAt: session.passwordReauthExpiresAt,
    };
  }

  private notify(vaultId: string) {
    const session = this.getSession(vaultId);
    const snapshot = this.snapshot(vaultId, session);
    session.listeners.forEach((listener) => listener(snapshot));
  }
}

export const vaultSessionManager = new VaultSessionManager();
