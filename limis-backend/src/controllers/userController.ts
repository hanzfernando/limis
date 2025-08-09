import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import { sendResponse } from "../utils/sendResponse";
import User from "../models/userModel"

export const getProfile = asyncHandler( async( req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id;

  const { _id, email } = req.user!;

  sendResponse(res, 200, "User profile fetched successfully", {
    id: _id.toString(),
    email,
  });
  return
})

export const changePassword = asyncHandler( async(req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id;
  const { currentPassword, newPassword } = req.body;

  if(!currentPassword || !newPassword ){
    sendResponse(res, 400, "Both current and new passwords are required.");
    return;
  }

  const user = await User.findById(userId);

  if(!user) {
    sendResponse(res, 404, "User not found.");
    return;
  }

  const success = await user.changePassword(currentPassword, newPassword);

  if(!success){
    sendResponse(res, 401, "Incorrect password.");
    return;
  }

  // Invalidate session (logout)
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  sendResponse(res, 200, "Password changed successfully.");
  return;
})

