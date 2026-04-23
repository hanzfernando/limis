import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../state/slices/authSlice";
import { logout as logoutService } from "../service/authService";
import type { RootState } from "../state/store";

export const useLogout = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);

  const logout = async () => {
    try {
      await logoutService(); // calls API to clear cookie/session on server
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logoutAction()); // clears user info from redux store regardless
    }
  };

  return { logout, loading };
};
