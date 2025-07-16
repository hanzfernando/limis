import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar'

const AuthLayout = () => {
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