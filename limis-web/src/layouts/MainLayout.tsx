import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] relative">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-4 top-3 z-50 animate-fadeIn md:hidden"
        >
          <RxHamburgerMenu size={24} />
        </Button>
      )}

      <main className="flex-1 h-screen overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
