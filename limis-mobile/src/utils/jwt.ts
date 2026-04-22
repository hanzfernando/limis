import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "@/src/types/auth";

interface JwtPayload {
  userId: string;
  email: string;
}

export function decodeAuthUser(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (!payload.userId || !payload.email) {
      return null;
    }

    return {
      id: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}
