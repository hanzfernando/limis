import { Request, Response } from 'express';
import User from '../models/userModel';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import { LoginResponseData, SignupResponseData } from '../types/Auth';
import { generateToken } from '../utils/generateToken';
import { AuthTokenPayload } from '../types/Auth';

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, vaultKeySalt } = req.body;

  if (!email || !password || !vaultKeySalt) {
    sendResponse(res, 400, "All fields are required.");
    return;
  }

  const origin = process.env.CLIENT_URL!;

  const user = await User.signup(email, password, vaultKeySalt, origin);

  const responseData: SignupResponseData = {
    email: user.email
  }

  sendResponse<SignupResponseData>(res, 201, "Signup successful. Please verify your email.", responseData);
  return;
});

// POST /api/auth/login
export const loginWithToken = asyncHandler(async ( req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password){
    sendResponse(res, 400, "All fields are required.")
    return
  }

  const user = await User.login(email, password);

  if(!user){
    sendResponse(res, 200, "Login failed.", undefined, "Invalid credentials.", false)
    return
  }

  if(!user.isVerified){
    sendResponse(res, 403, "Please verify your email.")
    return
  }

  const userId = user._id.toString();

  const payload: AuthTokenPayload = {
    userId,
    email
  }

  const token = generateToken(payload);

  const loginData: LoginResponseData = {
    token
  }

  sendResponse(res, 200, "Login Successful", loginData)
  return
})

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    sendResponse(res, 400, "All fields are required.");
    return 
  }

  const user = await User.login(email, password);

  if(!user){
    sendResponse(res, 200, "Login failed.", undefined, "Invalid credentials.", false)
    return
  }

  if (!user.isVerified) {
    sendResponse(res, 403, "Email not verified.", undefined, "Please verify your email.", false);
    return 
  }

  const payload: AuthTokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const token = generateToken(payload);

  // Set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, 200, "Login successful.");
  return 
});

// POST /api/auth/logout 
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  sendResponse(res, 200, "Logged out successfully.");
});

// GET /auth/verify-email
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