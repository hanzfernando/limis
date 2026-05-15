import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/authService";
import { useDispatch } from "react-redux";
import type { LoginInput } from "../types/Auth";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../state/slices/authSlice";
import { getProfile } from "../service/userService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import AuthCard from "../components/ui/auth-card";
import PasswordField from "../components/ui/password-field";
import AuthBrandPanel from "../components/AuthBrandPanel";
import { Mail } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      console.log("All input fields required.");
      return;
    }

    dispatch(loginStart());

    const loginInput: LoginInput = {
      email,
      password,
    };

    try {
      setError("");
      const res = await login(loginInput);
      if (!res.success) throw new Error(res.error);

      const profile = await getProfile();
      if (profile.success && profile.data) {
        dispatch(loginSuccess({ user: profile.data }));
        navigate("/vaults");
      } else {
        throw new Error("Unable to fetch user");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(loginFailure({ error: err.message }));
      setError(err.message);
    }
  };

  return (
    <main className="w-full px-4">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
        <AuthBrandPanel />
        <AuthCard
          title="Unlock Limis"
          description="Return to your encrypted archive."
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="pl-10"
              />
            </div>
          </div>
          <PasswordField
            id="login-password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            placeholder="Enter your password"
          />

          <Button type="submit" className="w-full">
            Unlock archive
          </Button>

          {error && (
            <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Create an archive
            </Link>
          </p>
        </form>
        </AuthCard>
      </div>
    </main>
  );
};

export default LoginPage;
