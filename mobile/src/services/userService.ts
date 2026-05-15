import { apiRequest } from "@/src/services/apiClient";

export function changePasswordRequest(input: {
  currentPassword: string;
  newPassword: string;
}) {
  return apiRequest<null>("/user/change-password", {
    method: "PATCH",
    body: input,
    credentials: "include",
  });
}
