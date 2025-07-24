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
