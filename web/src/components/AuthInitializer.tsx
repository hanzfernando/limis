// components/AuthInitializer.tsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout, selectAuthChecked, setAuthChecked } from "../state/slices/authSlice";
import { getProfile } from "../service/userService";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const authChecked = useSelector(selectAuthChecked);

  useEffect(() => {
    if (authChecked) {
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          dispatch(loginSuccess({ user: res.data }));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setAuthChecked());
      }
    };

    fetchUser();
  }, [authChecked, dispatch]);

  if (!authChecked) return null;

  return <Outlet />;
};

export default AuthInitializer;
