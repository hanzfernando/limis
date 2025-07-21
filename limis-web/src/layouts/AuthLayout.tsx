import { Outlet, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { selectAuthUser } from '../state/slices/authSlice';

const AuthLayout = () => {
  const auth = useSelector(selectAuthUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/vault', { replace: true });
    }
  }, [auth, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Topbar />
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
