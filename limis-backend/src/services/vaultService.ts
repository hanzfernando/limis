import Vault from '../models/vaultModel';
import type {
  CreateVaultInput,
  DeleteVaultResult,
  UpdateVaultPayloadInput,
  VaultDetailDto,
  VaultSummaryDto,
} from '../types/Vault';

export const createVault = async (input: CreateVaultInput): Promise<VaultDetailDto> => {
  const createdVault = await Vault.create({
    userId: input.userId,
    name: input.name,
    desc: input.desc,
    ciphertext: input.ciphertext,
    salt: input.salt,
    iv: input.iv,
  });

  return {
    id: createdVault._id.toString(),
    name: createdVault.name,
    desc: createdVault.desc,
    ciphertext: createdVault.ciphertext,
    iv: createdVault.iv,
    salt: createdVault.salt,
  };
};

export const getVaultsByUserId = async (userId: string): Promise<VaultSummaryDto[]> => {
  const vaults = await Vault.find({ userId }).select('name desc').lean();

  return vaults.map((vault) => ({
    id: vault._id.toString(),
    name: vault.name,
    desc: vault.desc,
  }));
};

export const getVaultByIdForUser = async (userId: string, vaultId: string): Promise<VaultDetailDto | null> => {
  const vault = await Vault.findOne({ _id: vaultId, userId }).lean();

  if (!vault) {
    return null;
  }

  return {
    id: vault._id.toString(),
    name: vault.name,
    desc: vault.desc,
    ciphertext: vault.ciphertext,
    iv: vault.iv,
    salt: vault.salt,
  };
};

export const deleteVaultByIdForUser = async (userId: string, vaultId: string): Promise<DeleteVaultResult> => {
  const vault = await Vault.findById(vaultId);

  if (!vault) {
    return 'not_found';
  }

  if (vault.userId.toString() !== userId) {
    return 'forbidden';
  }

  await vault.deleteOne();
  return 'deleted';
};

export const updateVaultPayload = async (
  input: UpdateVaultPayloadInput
): Promise<VaultDetailDto | null> => {
  const vault = await Vault.findOne({ _id: input.vaultId, userId: input.userId });

  if (!vault) {
    return null;
  }

  vault.ciphertext = input.ciphertext;
  vault.iv = input.iv;
  vault.salt = input.salt;
  await vault.save();

  return {
    id: vault._id.toString(),
    name: vault.name,
    desc: vault.desc,
    ciphertext: vault.ciphertext,
    iv: vault.iv,
    salt: vault.salt,
  };
};
