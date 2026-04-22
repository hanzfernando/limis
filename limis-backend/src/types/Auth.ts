import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "./User";

export interface SignupResponseData {
  email: string;
}

export interface LoginResponseData {
  token: string;
}

export interface SignupInput {
  email: string;
  password: string;
  vaultKeySalt: string;
}

export type LoginStatus = 'success' | 'invalid_credentials' | 'email_not_verified';

export interface LoginResult {
  status: LoginStatus;
  data?: LoginResponseData;
}

export interface AuthTokenPayload {
  userId: string,
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: HydratedDocument<IUser>;
}
