import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../service/authService";
import type { SignupInput } from "../types/Auth";
import { generateVaultKeySalt } from "../utils/generateVaultKeySalt";
import { showToast } from "../utils/showToast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import AuthCard from "../components/ui/auth-card";
import PasswordField from "../components/ui/password-field";
import AuthBrandPanel from "../components/AuthBrandPanel";
import { Mail } from "lucide-react";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!email || !password || !confirmPassword) {
      errors.push("All fields are required.");
    }

    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setIsLoading(true);

    try {
      const vaultKeySalt = generateVaultKeySalt();
      const signupInput: SignupInput = { email, password, vaultKeySalt };
      await signup(signupInput);

      showToast("Signup successful! Please verify your email.", "success");
      navigate("/auth/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setFormErrors([err.message || "Signup failed"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full px-4">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
        <AuthBrandPanel />
        <AuthCard
          title="Create your archive"
          description="Set up your private credential home with a master key only you control."
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <PasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />

          <PasswordField
            id="signup-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder="Re-enter password"
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create archive"}
          </Button>

          {formErrors.length > 0 && (
            <ul className="space-y-1 rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {formErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
        </AuthCard>
      </div>
    </main>
  );
};

export default SignupPage;
