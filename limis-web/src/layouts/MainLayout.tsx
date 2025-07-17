import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getProfile } from "../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, selectAuthUser } from "../state/slices/authSlice";
import LogoutButton from "../components/LogoutButton";

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          dispatch(loginSuccess({ user: res.data }));
        } else {
          navigate("/", { replace: true }); // not authenticated
        }
      } catch {
        navigate("/", { replace: true }); // not authenticated
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  // Optional: In case state is cleared before redirect triggers
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <Outlet />
      <LogoutButton />
    </>
  );
};

export default MainLayout;
