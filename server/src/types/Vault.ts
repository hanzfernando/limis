import type {
  CreateVaultPayloadContract,
  UpdateVaultMetadataContract,
  UpdateVaultPayloadContract,
  VaultDetailContract,
  VaultSummaryContract,
} from "../contracts/vault.contract";

export interface CreateVaultInput extends CreateVaultPayloadContract {
  userId: string;
}

export interface UpdateVaultPayloadInput extends UpdateVaultPayloadContract {
  userId: string;
  vaultId: string;
}

export interface UpdateVaultMetadataInput extends UpdateVaultMetadataContract {
  userId: string;
  vaultId: string;
}

export interface VaultSummaryDto extends VaultSummaryContract {}

export interface VaultDetailDto extends VaultDetailContract {}

export type DeleteVaultResult = 'deleted' | 'not_found' | 'forbidden';
