import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/Auth';

export function generateToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}
