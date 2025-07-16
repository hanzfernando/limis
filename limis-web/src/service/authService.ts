import type { SignupResponseData } from "../types/responses/Auth";
import { apiRequest } from "../utils/apiRequest";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export function signup(email: string, password: string, vaultKeySalt: string) {
  return apiRequest<SignupResponseData>(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, vaultKeySalt }),
  });
}



export function verifyEmail(token: string, email: string) {
  return apiRequest<null>(`${API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`);
}
