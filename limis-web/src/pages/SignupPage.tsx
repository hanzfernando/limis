import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../service/authService"; // Adjust path as needed
import type { SignupInput } from "../types/Auth";
import { generateVaultKeySalt } from "../utils/generateVaultKeySalt";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    

    try {
      const vaultKeySalt = generateVaultKeySalt();
      const signupInput: SignupInput = {
        email,
        password,
        vaultKeySalt
      }
      await signup(signupInput); 
      alert("Signup successful! Please verify your email.");
      navigate("/auth/login"); 
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full max-w-sm bg-gray-100 dark:bg-zinc-900 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-8 rounded shadow-md w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white">Sign Up</h2>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}

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
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignupPage;
