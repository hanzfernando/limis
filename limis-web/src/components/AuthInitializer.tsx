// components/AuthInitializer.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../state/slices/authSlice";
import { getProfile } from "../service/userService";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
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
        setChecked(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (!checked) return <div className="text-center p-8">Checking session...</div>;

  return <Outlet />;
};

export default AuthInitializer;
