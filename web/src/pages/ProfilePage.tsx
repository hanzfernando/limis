import { useState } from "react";
import { changePassword } from "../service/userService";
import { showToast } from "../utils/showToast";
import { useLogout } from "../hooks/useLogout";
import PageContainer from "../components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import PasswordField from "../components/ui/password-field";
import { Button } from "../components/ui/button";
import { KeyRound, ShieldCheck } from "lucide-react";

const ProfilePage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
    <PageContainer className="flex items-center">
      <Card className="archive-surface mx-auto w-full max-w-md overflow-hidden bg-card/90">
        <div className="archive-line h-px" />
        <CardHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle>Profile security</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Rotate your access key to keep the archive guarded.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              id="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
            />
            <PasswordField
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              required
              minLength={6}
            />
            <PasswordField
              id="confirm-new-password"
              label="Confirm New Password"
              value={confirmNewPassword}
              onChange={setConfirmNewPassword}
              required
            />

            {error && (
              <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              <KeyRound className="h-4 w-4" />
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default ProfilePage;
