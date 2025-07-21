import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";
import LogoutButton from "./LogoutButton";
import type { NavItem } from "../types/NavItem";

const SidebarWeb = ({
  open,
  setOpen,
  navItems,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  navItems: NavItem[];
}) => {
  const user = useSelector(selectAuthUser);

  return (
    <aside className={`hidden md:flex flex-col h-screen
      bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100
      transition-all duration-300 ease-in-out
      ${open ? "w-60" : "w-16"}`}
    >

      {open ? (
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
          <span className="text-xl font-semibold">Limis</span>
          <button onClick={() => setOpen(false)}>
            <IoClose size={20} />
          </button>
        </div>
      ) : (
        <div className="flex justify-center p-4 border-b dark:border-zinc-700">
          <button onClick={() => setOpen(true)}>
            <RxHamburgerMenu size={20} />
          </button>
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
          >
            <Icon size={20} />
            {open && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t dark:border-zinc-700">
        <div className="flex items-center gap-3 mb-2">
          {open && <span className="text-sm truncate">{user?.email ?? "Anonymous"}</span>}
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default SidebarWeb;
