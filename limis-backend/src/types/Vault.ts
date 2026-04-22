export interface CreateVaultInput {
  userId: string;
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

export interface UpdateVaultPayloadInput {
  userId: string;
  vaultId: string;
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface VaultSummaryDto {
  id: string;
  name: string;
  desc: string;
}

export interface VaultDetailDto {
  id: string;
  name: string;
  desc: string;
  ciphertext: string;
  iv: string;
  salt: string;
}

export type DeleteVaultResult = 'deleted' | 'not_found' | 'forbidden';
