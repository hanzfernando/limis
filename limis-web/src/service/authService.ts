import type { LoginInput, LoginResponseData, SignupInput, SignupResponseData } from "../types/Auth";
import { apiRequest } from "../utils/apiRequest";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function signup(input: SignupInput) {
  return apiRequest<SignupResponseData>(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput){
  return apiRequest<LoginResponseData>(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
}

export function verifyEmail(token: string, email: string) {
  return apiRequest<null>(`${API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`);
}

export function logout() {
  return apiRequest<null>(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}