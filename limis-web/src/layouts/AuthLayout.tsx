import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar'
import { useEffect } from 'react';
import { getProfile } from '../service/userService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../state/slices/authSlice';

const AuthLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile(); 
        console.log(res);

        if (res.success && res.data) {
          dispatch(loginSuccess({user: res.data}));
          navigate('/dashboard', { replace: true });
        } else {
          dispatch(loginFailure({error: 'Not authenticated'}));
        }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(loginFailure({error: 'Failed to authenticate'}));
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