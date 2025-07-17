import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/Auth';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User, token: string}>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<{ error: string}>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer