import type {
  AuthUserContract,
  LoginInputContract,
  LoginResponseDataContract,
  SignupInputContract,
} from "@/src/contracts/auth.contract";

export type LoginInput = LoginInputContract;
export type SignupInput = SignupInputContract;
export type AuthUser = AuthUserContract;
export type LoginResponseData = LoginResponseDataContract;

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}
