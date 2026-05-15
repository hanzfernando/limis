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
      navigate('/vaults', { replace: true });
    }
  }, [auth, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
