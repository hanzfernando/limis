import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/Auth';

const initialState: AuthState = {
  user: null,
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
    loginSuccess(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<{ error: string}>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer

// Selector
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;