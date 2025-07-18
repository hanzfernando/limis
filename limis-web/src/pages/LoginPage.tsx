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
      password
    }

    try {
      setError(""); // Clear previous error
      const res = await login(loginInput);
      if (!res.success) throw new Error(res.error);

      const profile = await getProfile();
      if (profile.success && profile.data) {
        dispatch(loginSuccess({ user: profile.data }));
        navigate("/dashboard");
      } else {
        throw new Error("Unable to fetch user");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(loginFailure({ error: err.message }));
      setError(err.message); // Set the error for display
    }

  };

  return (
    <main className="w-full px-4 max-w-sm bg-gray-100 dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-8 rounded shadow-md w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white">Login</h2>
        
       
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-300 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Log In
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}


        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
