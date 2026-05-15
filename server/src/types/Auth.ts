import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "./User";
import type {
  AuthTokenPayloadContract,
  LoginResponseDataContract,
  SignupInputContract,
  SignupResponseDataContract,
} from "../contracts/auth.contract";

export type SignupResponseData = SignupResponseDataContract;
export type LoginResponseData = LoginResponseDataContract;
export type SignupInput = SignupInputContract;

export type LoginStatus = 'success' | 'invalid_credentials' | 'email_not_verified';

export interface LoginResult {
  status: LoginStatus;
  data?: LoginResponseData;
}

export type AuthTokenPayload = AuthTokenPayloadContract;

export interface AuthenticatedRequest extends Request {
  user?: HydratedDocument<IUser>;
}
