import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "./User";

export interface SignupResponseData {
  email: string;
}

export interface LoginResponseData {
  token: string;
}

export interface AuthTokenPayload {
  userId: string,
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: HydratedDocument<IUser>;
}
