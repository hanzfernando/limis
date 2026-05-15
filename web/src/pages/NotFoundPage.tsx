import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <h1 className="mb-4 text-6xl font-semibold">404</h1>
      <p className="mb-8 max-w-lg text-xl text-muted-foreground">
        Page not found. The page you are looking for does not exist or has been moved.
      </p>
      <Button type="button" onClick={handleGoHome}>
        <ArrowLeft className="h-4 w-4" />
        Go back home
      </Button>
    </div>
  );
};

export default NotFoundPage;
