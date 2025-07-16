import { HydratedDocument, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string | null;
  vaultKeySalt: string;

  // Instance methods
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  signup(
    email: string,
    password: string,
    vaultKeySalt: string,
    origin: string
  ): Promise<HydratedDocument<IUser>>;

  login(email: string, password: string): Promise<HydratedDocument<IUser>>;
}
