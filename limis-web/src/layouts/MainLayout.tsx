import { Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* You may add a Navbar here */}
      <main className="flex-1">
        <Outlet />
        <LogoutButton />

      </main>
    </div>
  );
};

export default MainLayout;
