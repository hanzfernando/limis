import {
  ChevronLeft,
  CircleCheck,
  KeyRound,
  LayoutGrid,
  LogOut,
  UserCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { Button } from "./ui/button";
import {
  Sidebar as SidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { cn } from "../lib/utils";
import BrandMark from "./BrandMark";

const navItems = [
  { label: "Vaults", icon: KeyRound, to: "/vaults" },
  { label: "Profile", icon: UserCircle, to: "/profile" },
];

export default function Sidebar() {
  const user = useSelector(selectAuthUser);
  const [showModal, setShowModal] = useState(false);
  const { logout, loading } = useLogout();
  const { state, setMobileOpen } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => setShowModal(true);
  const confirmLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      <SidebarShell className="bg-card/90">
        <SidebarHeader className="p-3">
          <div className="archive-surface relative overflow-hidden rounded-lg bg-card/80 p-3 shadow-none">
            <div className="archive-line absolute left-4 right-4 top-0 h-px" />
            <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "justify-between")}>
              <BrandMark
                showWordmark={!collapsed}
                className={cn(collapsed && "justify-center [&>span:first-child]:h-9 [&>span:first-child]:w-9")}
              />

              <SidebarTrigger
                aria-label="Hide sidebar"
                title="Hide sidebar"
                className="h-8 w-8 shrink-0 rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </SidebarTrigger>
            </div>

            {!collapsed && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background/55 px-3 py-2">
                <CircleCheck className="h-4 w-4 shrink-0 text-primary" />
                <p className="min-w-0 truncate text-sm text-muted-foreground">{user?.email}</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className={cn("px-3", collapsed && "px-2")}>
          {!collapsed && (
            <div className="mb-3 rounded-lg border border-border bg-background/45 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LayoutGrid className="h-4 w-4 text-primary" />
                Auri workspace
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Calm access to your sealed credential archive.
              </p>
            </div>
          )}

          <SidebarGroup>
            <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  title={collapsed ? label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex h-10 w-full items-center rounded-md border px-3 text-sm transition-colors",
                      collapsed ? "justify-center px-0" : "justify-start gap-3",
                      isActive
                        ? "border-primary/25 bg-[var(--color-brand-muted)] text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                      )}
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className={cn("p-3", collapsed && "p-2")}>
          <div
            className={cn(
              "rounded-lg border border-border bg-background/45 p-3",
              collapsed && "flex flex-col items-center gap-3 p-2"
            )}
          >
            {collapsed ? (
              <>
                <ThemeToggleButton />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Sign out"
                  onClick={handleLogout}
                  disabled={loading}
                  className="border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggleButton />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full justify-start border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            )}
          </div>
        </SidebarFooter>
      </SidebarShell>

      {showModal && (
        <ConfirmLogoutModal
          onClose={() => setShowModal(false)}
          onConfirm={confirmLogout}
        />
      )}
    </>
  );
}
