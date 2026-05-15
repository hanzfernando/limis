import type {
  CreateVaultPayloadContract,
  UpdateVaultPayloadContract,
  VaultDetailContract,
  VaultSummaryContract,
} from "../contracts/vault.contract";

export type Vault = VaultSummaryContract;
export type VaultDetail = VaultDetailContract;
export type EncryptedVaultPayload = CreateVaultPayloadContract;
export type UpdateVaultPayload = UpdateVaultPayloadContract;

export interface VaultState {
  vaults: Vault[] | null; // 
  vaultDetails: Record<string, VaultDetail>; 
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}


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
