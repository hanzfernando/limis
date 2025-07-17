import { useLogout } from "../hooks/useLogout";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
