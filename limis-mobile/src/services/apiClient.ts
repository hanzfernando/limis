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
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching URL:", url);

  try {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    console.log(`API Request: ${options.method ?? "GET"} ${endpoint}`);
    console.log("Request options:", options);
    console.log("Response status:", response.status);


    const rawBody = await response.text();

    console.log("Response body:", rawBody);

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
  }catch (err) {
    console.log("Fetch error:", err);
    throw err;
  }

}
