// services/vaultService.ts

import { apiRequest } from "../utils/apiRequest";
import type { EncryptedVaultPayload } from "../types/Vault";
import type { ServerResponse } from "../types/responses/ServerResponse";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function addVault(payload: EncryptedVaultPayload): Promise<ServerResponse<null>> {
  return apiRequest<null>(`${API_BASE_URL}/vaults`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
