import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import vaultReducer from './slices/vaultSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vaults: vaultReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store