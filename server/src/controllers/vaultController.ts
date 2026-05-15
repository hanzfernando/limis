import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import type { AuthenticatedRequest } from '../types/Auth';
import {
  createVault,
  deleteVaultByIdForUser,
  getVaultByIdForUser,
  getVaultsByUserId,
  updateVaultMetadata,
  updateVaultPayload,
} from '../services/vaultService';

// POST /api/vaults
export const addVault = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, desc, ciphertext, salt, iv } = req.body;

  if (!name || !ciphertext || !salt || !iv) {
    sendResponse(res, 400, 'Missing required fields.');
    return 
  }

  const vault = await createVault({
    userId: user._id.toString(),
    name,
    desc,
    ciphertext,
    salt,
    iv,
  });

  sendResponse(res, 201, 'Vault created successfully.', vault);
});


// GET /api/vaults
export const getVaults = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaults = await getVaultsByUserId(user._id.toString());

  sendResponse(res, 200, "Vaults fetched successfully.", vaults);
});

// GET /api/vaults/:id
export const getVaultById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = String(req.params.id);

  const vault = await getVaultByIdForUser(user._id.toString(), vaultId);

  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return;
  }

  sendResponse(res, 200, "Vault fetched successfully.", vault);
});

export const deleteVaultById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = String(req.params.id);

  const result = await deleteVaultByIdForUser(user._id.toString(), vaultId);

  if (result === 'not_found') {
    sendResponse(res, 404, "Vault not found or access denied.");
    return;
  }

  if (result === 'forbidden') {
    sendResponse(res, 403, "Not authorized to delete this vault.");
    return;
  }

  sendResponse(res, 200, "Vault deleted successfully.");
  return;
})

export const updateVault = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = String(req.params.id);
  const { ciphertext, iv, salt } = req.body;

  if (!ciphertext || !iv || !salt) {
    sendResponse(res, 400, "Missing encryption payload.");
    return 
  }

  const vault = await updateVaultPayload({
    userId: user._id.toString(),
    vaultId,
    ciphertext,
    iv,
    salt,
  });

  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return 
  }

  sendResponse(res, 200, "Vault updated successfully.", {
    id: vault.id,
    name: vault.name,
    desc: vault.desc,
    ciphertext: vault.ciphertext,
    iv: vault.iv,
    salt: vault.salt,
  });
  return 
});

export const updateVaultDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = String(req.params.id);
  const { name, desc } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    sendResponse(res, 400, "Vault name is required.");
    return;
  }

  if (desc !== undefined && typeof desc !== 'string') {
    sendResponse(res, 400, "Vault description must be text.");
    return;
  }

  const vault = await updateVaultMetadata({
    userId: user._id.toString(),
    vaultId,
    name,
    desc,
  });

  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return;
  }

  sendResponse(res, 200, "Vault details updated successfully.", vault);
});
