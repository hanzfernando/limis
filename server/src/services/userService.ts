import type { HydratedDocument } from 'mongoose';
import User from '../models/userModel';
import type { IUser } from '../types/User';

export interface UserProfileDto {
  id: string;
  email: string;
}

export type ChangePasswordStatus = 'success' | 'user_not_found' | 'invalid_password';


export const mapUserToProfile = (user: HydratedDocument<IUser>): UserProfileDto => {
  return {
    id: user._id.toString(),
    email: user.email,
  };
};

export const changePasswordForUser = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordStatus> => {
  const user = await User.findById(userId);

  if (!user) {
    return 'user_not_found';
  }

  const success = await user.changePassword(currentPassword, newPassword);

  if (!success) {
    return 'invalid_password';
  }

  return 'success';
};
