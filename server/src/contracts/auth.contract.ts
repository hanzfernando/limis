export interface UserContract {
  id: string;
  email: string;
}

export interface SignupInputContract {
  email: string;
  password: string;
  vaultKeySalt: string;
}

export interface LoginInputContract {
  email: string;
  password: string;
}

export interface SignupResponseDataContract {
  email: string;
}

export interface LoginResponseDataContract {
  token: string;
}

export interface AuthTokenPayloadContract {
  userId: string;
  email: string;
}
