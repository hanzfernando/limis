import { NavLink } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import { buttonVariants } from './ui/button';
import { cn } from '../lib/utils';

const Topbar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-4 py-4 shadow-sm md:px-6">
      <NavLink
        to="/"
        className="flex items-center gap-3 text-2xl font-bold uppercase text-foreground transition hover:opacity-90"
      >
        <img
          src="/limis_icon.svg" 
          className="w-10 h-10"
          alt="Limis logo"
        />
        Limis
      </NavLink>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggleButton />

        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }))
          }
        >
          Login
        </NavLink>

        <NavLink
          to="/auth/signup"
          className={({ isActive }) =>
            cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }))
          }
        >
          Signup
        </NavLink>
      </div>
    </nav>
  );
};

export default Topbar;
