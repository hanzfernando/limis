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

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean
}

export interface User {
  id: string;
  email: string;
}
