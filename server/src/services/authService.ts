import User from '../models/userModel';
import { generateToken } from '../utils/generateToken';
import type { AuthTokenPayload, SignupResponseData, LoginResult, SignupInput } from '../types/Auth';

export const signupUser = async (input: SignupInput): Promise<SignupResponseData> => {
  const user = await User.signup(input.email, input.password, input.vaultKeySalt);

  return {
    email: user.email,
  };
};

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const user = await User.login(email, password);

  if (!user) {
    return {
      status: 'invalid_credentials',
    };
  }

  if (!user.isVerified) {
    return {
      status: 'email_not_verified',
    };
  }

  const payload: AuthTokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  return {
    status: 'success',
    data: {
      token: generateToken(payload),
    },
  };
};

export const verifyUserEmail = async (email: string, token: string): Promise<boolean> => {
  const user = await User.findOne({ email, verificationToken: token });

  if (!user) {
    return false;
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return true;
};
