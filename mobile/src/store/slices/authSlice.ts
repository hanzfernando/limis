import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginRequest, logoutRequest, signupRequest } from "@/src/services/authService";
import { vaultSessionManager } from "@/src/services/vaultSessionManager";
import type { AuthState, LoginInput, SignupInput } from "@/src/types/auth";
import { clearAuthToken, getAuthToken, saveAuthToken } from "@/src/utils/authStorage";
import { decodeAuthUser } from "@/src/utils/jwt";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  authChecked: false,
};

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong.";
}

export const hydrateAuthThunk = createAsyncThunk(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return null;
      }

      const user = decodeAuthUser(token);

      if (!user) {
        await clearAuthToken();
        return null;
      }

      return { token, user };
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const response = await loginRequest(input);
      const token = response.data?.token;

      if (!token) {
        return rejectWithValue("Login succeeded but token was not returned.");
      }

      const user = decodeAuthUser(token);

      if (!user) {
        return rejectWithValue("Could not read token payload.");
      }

      await saveAuthToken(token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (input: SignupInput, { rejectWithValue }) => {
    try {
      await signupRequest(input);
      return true;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutRequest();
  } catch {
    // Ignore API logout failures and always clear local session.
  }

  await clearAuthToken();
  await vaultSessionManager.logoutAll().catch(() => {});
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuthThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hydrateAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;

        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(hydrateAuthThunk.rejected, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.token = null;
        state.user = null;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not restore session.";
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Login failed.";
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Signup failed.";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
