import { API_BASE_URL } from "@/src/config/env";
import type { ApiResponse } from "@/src/types/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const rawBody = await response.text();
  const payload = rawBody
    ? (JSON.parse(rawBody) as ApiResponse<T>)
    : ({
        success: response.ok,
        message: response.ok ? "Request successful" : "Request failed",
        status: response.status,
      } as ApiResponse<T>);

  if (!response.ok || !payload.success) {
    const errorMessage = payload.error ?? payload.message ?? "Request failed.";
    throw new Error(errorMessage);
  }

  return payload;
}
