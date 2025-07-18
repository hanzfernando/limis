// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";

const ProtectedRoute = () => {
  const user = useSelector(selectAuthUser);

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
