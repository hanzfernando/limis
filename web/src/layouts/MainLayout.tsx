import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../components/ui/sidebar";
import { cn } from "../lib/utils";

function MainSidebarTrigger() {
  const { state } = useSidebar();

  return (
    <SidebarTrigger
      aria-label="Show sidebar"
      title="Show sidebar"
      className={cn(
        "absolute left-4 top-3 z-30 h-9 w-9 animate-fadeIn rounded-md border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur hover:bg-accent hover:text-foreground",
        state === "expanded" ? "md:hidden" : "md:inline-flex"
      )}
    />
  );
}

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen min-h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />

        <MainSidebarTrigger />

        <main className="relative h-screen min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
