import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar'
import { useEffect } from 'react';
import { getProfile } from '../service/userService';
import { useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const checkAuth = async () => {
    const res = await getProfile();
    if (res.success && res.data) {
      navigate("/dashboard", { replace: true });
    }
  };

  checkAuth();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return(
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Topbar />
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout;