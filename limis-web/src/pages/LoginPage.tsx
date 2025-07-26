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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getProfile } from "../service/userService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="w-full px-4 max-w-sm bg-[var(--color-background)] text-[var(--color-foreground)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-surface)] p-8 rounded shadow-md w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)]"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 pr-10 border border-[var(--color-border)] rounded bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)]"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-brand)] hover:opacity-90 text-white px-4 py-2 rounded transition"
        >
          Log In
        </button>

        {error && (
          <p className="text-[var(--color-danger)] text-sm text-center">{error}</p>
        )}

        <p className="text-center text-sm text-[var(--color-muted)]">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-[var(--color-brand)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
