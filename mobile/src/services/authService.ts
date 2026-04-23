import { apiRequest } from "@/src/services/apiClient";
import type { LoginInput, LoginResponseData, SignupInput } from "@/src/types/auth";

export function signupRequest(input: SignupInput) {
  return apiRequest<null>("/auth/signup", {
    method: "POST",
    body: input,
  });
}

export function loginRequest(input: LoginInput) {
  return apiRequest<LoginResponseData>("/auth/login", {
    method: "POST",
    body: input,
    credentials: "include",
  });
}

export function logoutRequest() {
  return apiRequest<null>("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
