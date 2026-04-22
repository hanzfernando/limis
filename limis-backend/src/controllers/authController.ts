import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import { LoginResponseData, SignupResponseData } from '../types/Auth';
import { loginUser, signupUser, verifyUserEmail } from '../services/authService';

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, vaultKeySalt } = req.body;

  if (!email || !password || !vaultKeySalt) {
    sendResponse(res, 400, "All fields are required.");
    return;
  }

  const responseData: SignupResponseData = await signupUser({
    email,
    password,
    vaultKeySalt,
  });

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

  const result = await loginUser(email, password);

  if (result.status === 'invalid_credentials') {
    sendResponse(res, 200, "Login failed.", undefined, "Invalid credentials.", false)
    return
  }

  if (result.status === 'email_not_verified') {
    sendResponse(res, 403, "Please verify your email.")
    return
  }

  const loginData: LoginResponseData = {
    token: result.data!.token,
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

  const result = await loginUser(email, password);

  if (result.status === 'invalid_credentials') {
    sendResponse(res, 200, "Login failed.", undefined, "Invalid credentials.", false)
    return
  }

  if (result.status === 'email_not_verified') {
    sendResponse(res, 403, "Email not verified.", undefined, "Please verify your email.", false);
    return 
  }

  // Set token in cookie
  res.cookie("token", result.data!.token, {
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

  const isVerified = await verifyUserEmail(String(email), String(token));

  if (!isVerified) {
    sendResponse(res, 404, "Invalid or expired token.");
    return;
  }

  sendResponse(res, 200, "Email verified successfully.");
  return;
});