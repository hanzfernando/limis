// components/GuestRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";

const GuestRoute = () => {
  const user = useSelector(selectAuthUser);

  return user ? <Navigate to="/vaults" replace /> : <Outlet />;
};

export default GuestRoute;
