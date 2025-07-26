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
import ProfilePage from "../pages/ProfilePage";
import VaultPage from "../pages/VaultPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthInitializer from "../components/AuthInitializer";
import VaultDetailPage from "../pages/VaultDetailPage";
import NotFoundPage from "../pages/NotFoundPage";

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
          <Route path="/vaults" element={<VaultPage />} />
          <Route path="/vaults/:id" element={<VaultDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Route>
  )
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
