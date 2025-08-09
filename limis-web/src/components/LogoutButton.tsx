import { TbLogout2 } from "react-icons/tb";

interface LogoutButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const LogoutButton = ({ onClick, disabled }: LogoutButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
      disabled={disabled}
    >
      <TbLogout2 size={18} />
      Logout
    </button>
  );
};

export default LogoutButton;
