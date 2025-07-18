// routes/AppRouter.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import VaultPage from "../pages/VaultPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthInitializer from "../components/AuthInitializer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthInitializer />}>
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vault" element={<VaultPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<p className="text-center p-8">404 - Page Not Found</p>}
      />
    </Route>
  )
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
