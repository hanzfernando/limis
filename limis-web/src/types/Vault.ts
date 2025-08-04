export interface Vault {
  id: string;
  name: string;
  desc?: string;
}

export interface VaultDetail {
  id: string;
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

export interface EncryptedVaultPayload {
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

// export interface EncryptedVaultPayload {
//   name: string;
//   desc: string;
//   version: number;
//   argon: {
//     type: number;
//     mem: number;
//     time: number;
//     hashLen: number;
//     parallelism: number;
//   };
//   salt: string;
//   iv: string;
//   ciphertext: string;
//   keyFingerprint: string;
//   plaintextHash: string;
// }

export interface VaultFormInput {
  title: string;
  username?: string;
  password?: string;
  note?: string;
  type?: string;
}

export interface VaultCredential {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string
  note?: string;
}

export interface UpdateVaultPayload {
  ciphertext: string;
  iv: string;
  salt: string;
}