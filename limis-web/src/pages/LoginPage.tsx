import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/authService";
import type { LoginInput } from "../types/Auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!email || !password){
      console.log("All input fields required.")
      return
    }

    const loginInput: LoginInput = {
      email,
      password
    }

    const res = await login(loginInput);
    if (res.success) {
      navigate("/dashboard");
    } else {
      console.log("Login failed:", res.message);
    }
  };

  return (
    <main className="w-full max-w-sm bg-gray-100 dark:bg-zinc-900">
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

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Log In
        </button>

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
