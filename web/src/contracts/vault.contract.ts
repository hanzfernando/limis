export interface VaultSummaryContract {
  id: string;
  name: string;
  desc?: string;
}

export interface VaultDetailContract {
  id: string;
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

export interface CreateVaultPayloadContract {
  name: string;
  desc?: string;
  ciphertext: string;
  salt: string;
  iv: string;
}

export interface UpdateVaultPayloadContract {
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface UpdateVaultMetadataContract {
  name: string;
  desc?: string;
}
