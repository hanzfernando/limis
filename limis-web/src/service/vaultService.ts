// services/vaultService.ts

import { apiRequest } from "../utils/apiRequest";
import type { EncryptedVaultPayload, UpdateVaultPayload, Vault, VaultDetail } from "../types/Vault";
import type { ServerResponse } from "../types/responses/ServerResponse";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function addVault(payload: EncryptedVaultPayload): Promise<ServerResponse<null>> {
  return apiRequest<null>(`${API_BASE_URL}/vaults`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


export function getVaults(): Promise<ServerResponse<Vault[]>> {
  return apiRequest<Vault[]>(`${API_BASE_URL}/vaults`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export function getVaultById(id: string): Promise<ServerResponse<VaultDetail>> {
  return apiRequest<VaultDetail>(`${API_BASE_URL}/vaults/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export function updateVault(id: string, payload: UpdateVaultPayload): Promise<ServerResponse<VaultDetail>> {
  return apiRequest<VaultDetail>(`${API_BASE_URL}/vaults/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}