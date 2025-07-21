import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../state/slices/authSlice";
import LogoutButton from "./LogoutButton";
import type { NavItem } from "../types/NavItem";

const SidebarMobile = ({
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
    <>
      <button
        className="fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-md md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose size={20} /> : <RxHamburgerMenu size={20} />}
      </button>

      {open && (
        <aside
          className="fixed top-0 left-0 w-60 h-screen z-40 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 flex flex-col md:hidden"
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
            <span className="text-xl font-semibold">Limis</span>
            <button onClick={() => setOpen(false)}>
              <IoClose size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                onClick={() => setOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm truncate">{user?.email ?? "Anonymous"}</span>
            </div>
            <LogoutButton />
          </div>
        </aside>
      )}
    </>
  );
};

export default SidebarMobile;
