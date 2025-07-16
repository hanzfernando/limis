import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage"; // placeholder

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public/Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Routes (logged in) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add more authenticated routes here */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<p className="text-center p-8">404 - Page Not Found</p>} />
    </>
  )
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
