export interface LoginInputContract {
  email: string;
  password: string;
}

export interface SignupInputContract {
  email: string;
  password: string;
  vaultKeySalt: string;
}

export interface AuthUserContract {
  id: string;
  email: string;
}

export interface LoginResponseDataContract {
  token: string;
}
