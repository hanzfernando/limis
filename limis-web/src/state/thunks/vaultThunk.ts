/* eslint-disable @typescript-eslint/no-unused-vars */
// state/thunks/vaultThunk.ts
// state/thunks/vaultThunk.ts
import type { AppDispatch } from '../store';
import {
  startLoading,
  setError,
  setVaults,
  setVaultDetail,

  updateVault as updateVaultAction,
  deleteVault as deleteVaultAction
} from '../slices/vaultSlice';

import {
  getVaults,
  getVaultById,

  addVault as addVaultService,
  updateVault as updateVaultService,
  deleteVaultById
} from '../../service/vaultService';

import type { EncryptedVaultPayload, UpdateVaultPayload } from '../../types/Vault';

export const fetchVaultsThunk = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const res = await getVaults();
    if (res.success && res.data) {
      dispatch(setVaults(res.data));
    } else {
      dispatch(setError(res.message ?? 'Failed to fetch vaults'));
    }
  } catch (err) {
    dispatch(setError('Unexpected error while fetching vaults'));
  }
};

export const fetchVaultDetailThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const res = await getVaultById(id);
    if (res.success && res.data) {
      dispatch(setVaultDetail(res.data));
    } else {
      dispatch(setError(res.message ?? 'Failed to fetch vault detail'));
    }
  } catch (err) {
    dispatch(setError('Unexpected error while fetching vault detail'));
  }
};

export const createVaultThunk = (payload: EncryptedVaultPayload) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const res = await addVaultService(payload);

    if (res.success) {
      dispatch(fetchVaultsThunk()); // Refresh the list after create
    } else {
      dispatch(setError(res.message ?? 'Failed to create vault'));
    }

    return res; 
  } catch (err) {
    const fallback = { success: false, message: 'Unexpected error while creating vault' };
    dispatch(setError(fallback.message));
    return fallback;
  }
};


export const updateVaultThunk = (id: string, payload: UpdateVaultPayload) => 
  async (dispatch: AppDispatch) => {
    try {
      const res = await updateVaultService(id, payload);

      if (!res.success) {
        dispatch(setError(res.message || "Failed to update vault"));
      } else {
        dispatch(updateVaultAction({ id, data: payload }));
      }

      return res; // return full response to use in component
    } catch (err) {
      dispatch(setError("Unexpected error while updating vault"));
      return { success: false, message: "Unexpected error" };
    }
  };
//
export const deleteVaultThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());

    const res = await deleteVaultById(id);

    if (res.success) {
      dispatch(deleteVaultAction(id));
    } else {
      dispatch(setError(res.message ?? 'Failed to delete vault'));
    }

    return res;
  } catch (err) {
    const fallback = { success: false, message: 'Unexpected error while deleting vault' };
    dispatch(setError(fallback.message));
    return fallback;
  }
};

