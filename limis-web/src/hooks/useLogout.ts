import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../state/slices/authSlice";
import { logout as logoutService } from "../service/authService";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await logoutService(); // calls API to clear cookie/session on server
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logoutAction()); // clears user info from redux store regardless
    }
  };

  return logout;
};
