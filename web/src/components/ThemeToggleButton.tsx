import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/useTheme";

type ThemeToggleButtonProps = {
  compact?: boolean;
};

export default function ThemeToggleButton({ compact = false }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    const Icon = isDark ? Moon : Sun;

    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 bg-background/70"
        aria-label="Toggle Theme"
        title="Toggle Theme"
      >
        <Icon className="h-4 w-4 text-primary" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className="relative h-8 w-14 rounded-full bg-background/70 px-1"
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
