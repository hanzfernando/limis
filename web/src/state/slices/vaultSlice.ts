import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UpdateVaultPayload, Vault, VaultDetail, VaultState } from '../../types/Vault';
import type { RootState } from '../store';

const initialState: VaultState = {
  vaults: [],
  vaultDetails: {},           // New: keyed by vault ID
  loading: false,
  error: null,
  authChecked: false
};

const vaultSlice = createSlice({
  name: 'vaults',
  initialState,
  reducers: {
    // General
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    stopLoading(state) {
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // READ: List of vaults (lightweight)
    setVaults(state, action: PayloadAction<Vault[]>) {
      state.vaults = action.payload;
      state.loading = false;
    },

    // READ: Single vault (detailed)
    setVaultDetail(state, action: PayloadAction<VaultDetail>) {
      const detail = action.payload;
      state.vaultDetails[detail.id] = detail;
      state.loading = false;
    },

    // CREATE
    addVault(state, action: PayloadAction<Vault>) {
      if (state.vaults) {
        state.vaults.push(action.payload);
      } else {
        state.vaults = [action.payload];
      }
      state.loading = false;
    },

    // UPDATE
    updateVault(state, action: PayloadAction<{ id: string; data: UpdateVaultPayload }>) {
      const { id, data } = action.payload;

      // Update in list
      const index = state.vaults?.findIndex((vault) => vault.id === id);
      if (index !== undefined && index !== -1 && state.vaults) {
        state.vaults[index] = { ...state.vaults[index], ...data };
      }

      // Update in detailed map if it exists
      if (state.vaultDetails[id]) {
        state.vaultDetails[id] = { ...state.vaultDetails[id], ...data };
      }

      state.loading = false;
    },

    // DELETE
    deleteVault(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.vaults) {
        state.vaults = state.vaults.filter((vault) => vault.id !== id);
      }

      delete state.vaultDetails[id];

      state.loading = false;
    },

    // RESET
    resetVaultState() {
      return initialState;
    }
  }
});

export const {
  startLoading,
  stopLoading,
  setError,
  setVaults,
  setVaultDetail,
  addVault,
  updateVault,
  deleteVault,
  resetVaultState
} = vaultSlice.actions;

export default vaultSlice.reducer;

// Base state
export const selectVaultState = (state: RootState) => state.vaults;

// Lightweight list
export const selectVaults = (state: RootState) => state.vaults.vaults;

// Single detail by ID
export const selectVaultDetailById = (state: RootState, id: string) =>
  state.vaults.vaultDetails[id];


// Flags
export const selectVaultLoading = (state: RootState) => state.vaults.loading;
export const selectVaultError = (state: RootState) => state.vaults.error;
