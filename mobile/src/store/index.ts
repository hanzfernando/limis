import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/store/slices/authSlice";
import vaultReducer from "@/src/store/slices/vaultSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vaults: vaultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
