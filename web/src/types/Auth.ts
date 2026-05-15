import type {
  LoginInputContract,
  LoginResponseDataContract,
  SignupInputContract,
  SignupResponseDataContract,
  UserContract,
} from "../contracts/auth.contract";

export type SignupResponseData = SignupResponseDataContract;
export type LoginResponseData = LoginResponseDataContract;
export type SignupInput = SignupInputContract;
export type LoginInput = LoginInputContract;
export type User = UserContract;

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean
}
