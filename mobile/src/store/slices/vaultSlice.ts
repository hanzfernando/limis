import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  CreateVaultPayload,
  UpdateVaultPayload,
  VaultDetail,
  VaultState,
  VaultSummary,
} from "@/src/types/vault";
import {
  createVaultRequest,
  deleteVaultRequest,
  fetchVaultByIdRequest,
  fetchVaultsRequest,
  updateVaultRequest,
} from "@/src/services/vaultService";

const initialState: VaultState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong.";
}

export const fetchVaultsThunk = createAsyncThunk(
  "vaults/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVaultsRequest();
      return response.data ?? [];
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const fetchVaultByIdThunk = createAsyncThunk(
  "vaults/fetchById",
  async (vaultId: string, { rejectWithValue }) => {
    try {
      const response = await fetchVaultByIdRequest(vaultId);
      if (!response.data) {
        return rejectWithValue("Vault not found.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const createVaultThunk = createAsyncThunk(
  "vaults/create",
  async (payload: CreateVaultPayload, { rejectWithValue }) => {
    try {
      const response = await createVaultRequest(payload);
      if (!response.data) {
        return rejectWithValue("Vault was not returned.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateVaultThunk = createAsyncThunk(
  "vaults/update",
  async (
    { vaultId, payload }: { vaultId: string; payload: UpdateVaultPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateVaultRequest(vaultId, payload);
      if (!response.data) {
        return rejectWithValue("Vault was not returned.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const deleteVaultThunk = createAsyncThunk(
  "vaults/delete",
  async (vaultId: string, { rejectWithValue }) => {
    try {
      await deleteVaultRequest(vaultId);
      return vaultId;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

const vaultSlice = createSlice({
  name: "vaults",
  initialState,
  reducers: {
    clearVaultError(state) {
      state.error = null;
    },
    clearSelectedVault(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaultsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVaultsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVaultsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load vaults.";
      })
      .addCase(fetchVaultByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVaultByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchVaultByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load vault.";
      })
      .addCase(createVaultThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVaultThunk.fulfilled, (state, action) => {
        state.loading = false;
        const detail = action.payload;
        const summary: VaultSummary = {
          id: detail.id,
          name: detail.name,
          desc: detail.desc,
        };
        state.items = [summary, ...state.items.filter((item) => item.id !== summary.id)];
        state.selected = detail;
      })
      .addCase(createVaultThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not create vault.";
      })
      .addCase(updateVaultThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVaultThunk.fulfilled, (state, action) => {
        state.loading = false;
        const detail = action.payload;
        state.selected = detail;
        state.items = state.items.map((item) =>
          item.id === detail.id
            ? { id: detail.id, name: detail.name, desc: detail.desc }
            : item
        );
      })
      .addCase(updateVaultThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not update vault.";
      })
      .addCase(deleteVaultThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVaultThunk.fulfilled, (state, action) => {
        state.loading = false;
        const vaultId = action.payload;
        state.items = state.items.filter((item) => item.id !== vaultId);
        if (state.selected?.id === vaultId) {
          state.selected = null;
        }
      })
      .addCase(deleteVaultThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not delete vault.";
      });
  },
});

export const { clearVaultError, clearSelectedVault } = vaultSlice.actions;
export default vaultSlice.reducer;
