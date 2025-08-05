import type { User } from "../types/Auth";
import { apiRequest } from "../utils/apiRequest";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getProfile() {
  return apiRequest<User>(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    credentials: "include", // send cookies
  });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<null>(`${API_BASE_URL}/user/change-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({currentPassword, newPassword})
  });
}