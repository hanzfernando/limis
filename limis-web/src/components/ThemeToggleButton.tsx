import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-15 h-8 flex items-center justify-between px-2 bg-zinc-300 dark:bg-zinc-600 rounded-full transition-colors duration-300 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {/* Left icon - Moon for dark mode */}
      <Moon className={`w-5 h-5 ${isDark ? "text-zinc-200" : "text-zinc-500"}`} />

      {/* Right icon - Sun for light mode */}
      <Sun className={`w-5 h-5 ${!isDark ? "text-black" : "text-zinc-400"}`} />

      {/* Toggle circle */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition-transform duration-300
        ${isDark ? "translate-x-0 bg-zinc-200" : "translate-x-7 bg-white"}`}
      />
    </button>
  );
}
