import { TbLogout2 } from "react-icons/tb";
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
      variant="destructive"
      className="w-full justify-start"
      disabled={disabled}
    >
      <TbLogout2 size={18} />
      Logout
    </Button>
  );
};

export default LogoutButton;
