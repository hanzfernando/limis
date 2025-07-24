import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../service/authService";
import type { SignupInput } from "../types/Auth";
import { generateVaultKeySalt } from "../utils/generateVaultKeySalt";
import { showToast } from "../utils/showToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <main className="w-full px-4 max-w-sm" style={{ backgroundColor: "var(--color-background)" }}>
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded shadow-md w-full space-y-6"
        style={{ backgroundColor: "var(--color-surface)", color: "var(--color-foreground)" }}
      >
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-foreground)",
          }}
        />

        {/* Password Field */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-4 py-2 pr-10 border rounded"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-foreground)",
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--color-muted)" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2 pr-10 border rounded"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-foreground)",
            }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--color-muted)" }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 rounded font-medium disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-brand)",
            color: "#fff",
          }}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {formErrors.length > 0 && (
          <ul className="space-y-1 text-sm text-center" style={{ color: "var(--color-danger)" }}>
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        <p className="text-center text-sm" style={{ color: "var(--color-muted)" }}>
          Already have an account?{" "}
          <Link to="/auth/login" className="hover:underline" style={{ color: "var(--color-brand)" }}>
            Log in
          </Link>
        </p>
      </form>
    </main>

  );
};

export default SignupPage;
