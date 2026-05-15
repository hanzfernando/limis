import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

function MainSidebarTrigger() {
  return (
    <SidebarTrigger
      aria-label="Show sidebar"
      title="Show sidebar"
      className="absolute left-4 top-3 z-30 h-9 w-9 animate-fadeIn rounded-md border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur hover:bg-accent hover:text-foreground md:hidden"
    />
  );
}

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen min-h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />

        <MainSidebarTrigger />

        <main className="relative min-h-screen min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
