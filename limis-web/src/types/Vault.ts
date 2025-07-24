export interface Vault {
  id: string;
  name: string;
  description?: string;
}

export interface EncryptedVaultPayload {
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

export interface VaultFormInput {
  title: string;
  username?: string;
  password?: string;
  note?: string;
  type?: string;
}
