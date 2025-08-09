import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../service/authService';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Click the button below to verify your email.");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyClick = async () => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setMessage("Invalid verification link.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      const res = await verifyEmail(token, email);

      if (res.success) {
        setMessage(res.message || "Email verified successfully.");
        setSuccess(true);
      } else {
        setMessage(res.message || "Verification failed.");
        setSuccess(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Something went wrong.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <div className={`p-6 rounded shadow-md max-w-md w-full text-center space-y-4
        ${success === true ? 'bg-green-100 text-green-700' : ''}
        ${success === false ? 'bg-red-100 text-red-700' : ''}
        ${success === null ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white' : ''}
      `}>
        <h1 className="text-2xl font-semibold">Email Verification</h1>
        <p>{message}</p>

        {success === null && (
          <button
            onClick={handleVerifyClick}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        )}
      </div>
    </main>
  );
};

export default VerifyEmailPage;
