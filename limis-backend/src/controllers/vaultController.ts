import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Vault from '../models/vaultModel';
import { sendResponse } from '../utils/sendResponse';
import type { AuthenticatedRequest } from '../types/Auth';

// POST /api/vaults
export const addVault = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, desc, ciphertext, salt, iv } = req.body;

  if (!name || !ciphertext || !salt || !iv) {
    sendResponse(res, 400, 'Missing required fields.');
    return 
  }

  const vault = await Vault.create({
    userId: user._id,
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

  const vaults = await Vault.find({ userId: user._id })
    .select("name desc") // exclude sensitive fields
    .lean();

  const formatted = vaults.map(vault => ({
    id: vault._id.toString(),
    name: vault.name,
    desc: vault.desc,
  }));

  sendResponse(res, 200, "Vaults fetched successfully.", formatted);
});

// GET /api/vaults/:id
export const getVaultById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = req.params.id;

  const vault = await Vault.findOne({ _id: vaultId, userId: user._id }).lean();

  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return;
  }

  const { _id, ...rest } = vault;
  const transformedVault = {
    id: _id.toString(),
    ...rest,
  };

  sendResponse(res, 200, "Vault fetched successfully.", transformedVault);
});

export const deleteVaultById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = req.params.id;

  const vault = await Vault.findById(vaultId);
  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return;
  }
  if(vault.userId.toString() !== user.id){
    sendResponse(res, 403, "Not authorized to delete this vault.");
    return;
  }

  await vault.deleteOne();

  sendResponse(res, 200, "Vault deleted successfully.");
  return;
})

export const updateVault = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const vaultId = req.params.id;
  const { ciphertext, iv, salt } = req.body;

  if (!ciphertext || !iv || !salt) {
    sendResponse(res, 400, "Missing encryption payload.");
    return 
  }

  const vault = await Vault.findOne({ _id: vaultId, userId: user._id });

  if (!vault) {
    sendResponse(res, 404, "Vault not found or access denied.");
    return 
  }

  vault.ciphertext = ciphertext;
  vault.iv = iv;
  vault.salt = salt;

  await vault.save();

  sendResponse(res, 200, "Vault updated successfully.", {
    id: vault._id,
    name: vault.name,
    desc: vault.desc,
    ciphertext: vault.ciphertext,
    iv: vault.iv,
    salt: vault.salt,
  });
  return 
});
