import { NavLink } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import { buttonVariants } from './ui/button';
import { cn } from '../lib/utils';
import BrandMark from './BrandMark';

const Topbar = () => {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/88 px-4 py-3 backdrop-blur-xl md:px-6">
      <NavLink
        to="/"
        className="text-foreground transition hover:opacity-90"
      >
        <BrandMark />
      </NavLink>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggleButton />

        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }))
          }
        >
          Unlock
        </NavLink>

        <NavLink
          to="/auth/signup"
          className={({ isActive }) =>
            cn(buttonVariants({ variant: isActive ? "default" : "outline", size: "sm" }))
          }
        >
          Create
        </NavLink>
      </div>
    </nav>
  );
};

export default Topbar;
