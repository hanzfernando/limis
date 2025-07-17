import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { getProfile } from "../service/userService";

const MainLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const res = await getProfile();
      if (!res.success || !res.data) {
        navigate("/auth/login", { replace: true });
      } else {
        setLoading(false); // Allow access
      }
    };
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  return <Outlet />;
}

export default MainLayout