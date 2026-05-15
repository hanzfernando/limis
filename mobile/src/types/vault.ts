import type {
  CreateVaultPayloadContract,
  UpdateVaultPayloadContract,
  VaultDetailContract,
  VaultSummaryContract,
} from "@/src/contracts/vault.contract";

export type VaultSummary = VaultSummaryContract;
export type VaultDetail = VaultDetailContract;
export type CreateVaultPayload = CreateVaultPayloadContract;
export type UpdateVaultPayload = UpdateVaultPayloadContract;

export interface VaultState {
  items: VaultSummary[];
  selected: VaultDetail | null;
  loading: boolean;
  error: string | null;
}
