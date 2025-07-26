import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[var(--color-background)] text-[var(--color-foreground)] px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-[var(--color-muted)] mb-8">
        Page not found. The page you are looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={handleGoHome}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] transition-colors shadow"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;
