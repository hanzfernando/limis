import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-4 top-3 z-50 animate-fadeIn bg-card/90 backdrop-blur md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <main className="relative h-screen flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
