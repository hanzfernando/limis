import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../service/authService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Click the button below to verify your email.");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p
            className={
              success === true
                ? "rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-300"
                : success === false
                ? "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive"
                : ""
            }
          >
            {message}
          </p>

          {success === null && (
            <form onSubmit={handleVerifyClick}>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default VerifyEmailPage;
