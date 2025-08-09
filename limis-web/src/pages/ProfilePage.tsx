import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../service/userService"; // adjust the path as needed
import { showToast } from "../utils/showToast";
import { useLogout } from "../hooks/useLogout";

const ProfilePage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const { logout } = useLogout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const res = await changePassword(currentPassword, newPassword);
      console.log(res)
      if(!res.success){
        showToast(`${res.message}`, "error")
        return;
      }
     
      showToast("Password successfully changed. Logging out", "success");
      logout();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Current Password */}
        <div className="relative">
          <label className="block font-medium mb-1">Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <span
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute top-10 right-3 text-gray-500 cursor-pointer"
          >
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block font-medium mb-1">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            onClick={() => setShowNew(!showNew)}
            className="absolute top-10 right-3 text-gray-500 cursor-pointer"
          >
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label className="block font-medium mb-1">Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-10 right-3 text-gray-500 cursor-pointer"
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
