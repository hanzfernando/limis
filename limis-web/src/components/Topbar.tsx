import { NavLink } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

const Topbar = () => {
  return (
    <nav className="flex justify-between p-6 shadow-md bg-[var(--color-surface)] transition-colors">
      <NavLink 
        to="/"
        className="text-lg uppercase font-bold text-[var(--color-foreground)]"
      >
        Limis
      </NavLink>
      <div className="flex items-center gap-4">
        <ThemeToggleButton />

        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? 'bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white'
                : 'border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]'
            }`
          }
        >
          Login
        </NavLink>

        <NavLink
          to="/auth/signup"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? 'bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white'
                : 'border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]'
            }`
          }
        >
          Signup
        </NavLink>
      </div>
    </nav>
  );
};

export default Topbar;
