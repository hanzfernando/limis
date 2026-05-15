import { AuthTokenPayload } from "../types/Auth";
import jwt from 'jsonwebtoken'

export function decodeToken(token: string): AuthTokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload
}