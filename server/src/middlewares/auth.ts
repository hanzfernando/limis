import { AuthenticatedRequest } from "../types/Auth"
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from "../utils/decodeToken";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel";
import { sendResponse } from "../utils/sendResponse";


export const authToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    sendResponse(res, 401, "Not authenticated");
    return
  }

  const decoded = decodeToken(token);

  if (!decoded || !decoded.userId) {
    sendResponse(res, 401, "Invalid or expired token");
    return 
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    sendResponse(res, 401, "User not found");
    return 
  }

  req.user = user;
  next();
});
