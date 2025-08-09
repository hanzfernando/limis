import { FaLock } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";
import LogoutButton from "./LogoutButton";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import ThemeToggleButton from "./ThemeToggleButton";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const user = useSelector(selectAuthUser);
  const [showModal, setShowModal] = useState(false);
  const { logout, loading } = useLogout();

  const navItems = [
    { label: "Vault", icon: FaLock, to: "/vaults" },
    { label: "Profile", icon: CgProfile, to: "/profile" },
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
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen border-r-1 border-[var(--color-border)]
        bg-[var(--color-surface)] text-[var(--color-foreground)]
        flex flex-col justify-between p-4 shadow-sm transition-transform duration-300
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0`}
      >
        <div>
          {/* Header */}
          <div className="mb-6 px-2">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Limis</h1>
              <button className="md:hidden" onClick={() => setOpen(false)}>
                <IoClose size={20} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 text-sm mb-auto">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-[var(--color-brand)] text-white"
                      : "hover:bg-[var(--color-brand-muted)]"
                  }`
                }
              >
                <Icon size={18} className="mr-2" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t mt-4 border-[var(--color-border)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
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
