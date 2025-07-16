import type { ServerResponse } from "../types/ServerResponse";

export async function apiRequest<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ServerResponse<T>> {
  try {
    const res = await fetch(input, init);
    const json = await res.json();
    return { ...json, status: res.status };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong.",
      error: (err as Error).message,
      status: 500,
    };
  }
}
