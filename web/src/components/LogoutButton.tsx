import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface LogoutButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const LogoutButton = ({ onClick, disabled }: LogoutButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className="w-full justify-start border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={disabled}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
