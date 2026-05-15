import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className="relative h-8 w-14 rounded-full px-1"
      aria-label="Toggle Theme"
    >
      <Moon className={`h-4 w-4 ${isDark ? "text-primary" : "text-muted-foreground"}`} />
      <Sun className={`h-4 w-4 ${!isDark ? "text-primary" : "text-muted-foreground"}`} />
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-primary/20 transition-transform duration-300 ${
          isDark ? "translate-x-0" : "translate-x-[22px]"
        }`}
      />
    </Button>
  );
}