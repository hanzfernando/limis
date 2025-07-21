import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "../components/Sidebar"; // adjust path
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-3 absolute top-2 left-4 z-50
                    rounded-md shadow
                    opacity-0 scale-95 animate-fadeIn"
        >
          <RxHamburgerMenu size={24} />
        </button>
      )}


      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto w-full px-4 mt-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
