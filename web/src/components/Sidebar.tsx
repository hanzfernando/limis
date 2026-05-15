import { CircleCheck, LockKeyhole, PanelLeftClose, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";
import LogoutButton from "./LogoutButton";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { Button } from "./ui/button";
import BrandMark from "./BrandMark";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const user = useSelector(selectAuthUser);
  const [showModal, setShowModal] = useState(false);
  const { logout, loading } = useLogout();

  const navItems = [
    { label: "Archive", icon: LockKeyhole, to: "/vaults" },
    { label: "Profile", icon: UserCircle, to: "/profile" },
  ];

  const handleLogout = () => setShowModal(true);
  const confirmLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-border
        bg-card/92 p-4 text-card-foreground shadow-sm backdrop-blur-xl transition-transform duration-300
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0`}
      >
        <div>
          <div className="mb-6 rounded-lg border border-border bg-background/45 p-3">
            <div className="flex items-center justify-between">
              <BrandMark />
              <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
              <CircleCheck className="h-4 w-4 text-primary" />
              <p className="min-w-0 truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">Workspace</p>
          <nav className="mb-auto space-y-1 text-sm">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-md px-3 py-2.5 transition-colors
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-background/45 p-3">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggleButton />
          </div>
          <LogoutButton onClick={handleLogout} disabled={loading} />
        </div>
      </aside>

      {/* Confirm modal */}
      {showModal && (
        <ConfirmLogoutModal
          onClose={() => setShowModal(false)}
          onConfirm={confirmLogout}
        />
      )}
    </>
  );
}
