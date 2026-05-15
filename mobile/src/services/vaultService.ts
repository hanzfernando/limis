import { apiRequest } from "@/src/services/apiClient";
import type {
  CreateVaultPayload,
  UpdateVaultMetadataPayload,
  UpdateVaultPayload,
  VaultDetail,
  VaultSummary,
} from "@/src/types/vault";

export function fetchVaultsRequest() {
  return apiRequest<VaultSummary[]>("/vaults", {
    method: "GET",
    credentials: "include",
  });
}

export function fetchVaultByIdRequest(vaultId: string) {
  return apiRequest<VaultDetail>(`/vaults/${vaultId}`, {
    method: "GET",
    credentials: "include",
  });
}

export function createVaultRequest(payload: CreateVaultPayload) {
  return apiRequest<VaultDetail>("/vaults", {
    method: "POST",
    body: payload,
    credentials: "include",
  });
}

export function updateVaultRequest(vaultId: string, payload: UpdateVaultPayload) {
  return apiRequest<VaultDetail>(`/vaults/${vaultId}`, {
    method: "PUT",
    body: payload,
    credentials: "include",
  });
}

export function updateVaultMetadataRequest(
  vaultId: string,
  payload: UpdateVaultMetadataPayload
) {
  return apiRequest<VaultDetail>(`/vaults/${vaultId}/details`, {
    method: "PATCH",
    body: payload,
    credentials: "include",
  });
}

export function deleteVaultRequest(vaultId: string) {
  return apiRequest<null>(`/vaults/${vaultId}`, {
    method: "DELETE",
    credentials: "include",
  });
}
