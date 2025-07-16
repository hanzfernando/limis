import { Request, Response } from 'express';
import User from '../models/userModel';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, vaultKeySalt } = req.body;

  if (!email || !password || !vaultKeySalt) {
    sendResponse(res, 400, "All fields are required.");
    return;
  }

  const origin = process.env.CLIENT_URL!;

  const user = await User.signup(email, password, vaultKeySalt, origin);

  sendResponse(res, 201, "Signup successful. Please verify your email.", {
    userId: user._id,
  });
  return;
});

// GET /api/auth/signup
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token, email } = req.query;

  if (!token || !email) {
    sendResponse(res, 400, "Invalid verification link.");
    return;
  }

  const user = await User.findOne({ email, verificationToken: token });

  if (!user) {
    sendResponse(res, 404, "Invalid or expired token.");
    return;
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  sendResponse(res, 200, "Email verified successfully.");
  return;
});