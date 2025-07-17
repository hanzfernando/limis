import { AuthenticatedRequest } from "../types/Auth"
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from "../utils/decodeToken";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel";

// export const authToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith('Bearer ')) {
//     res.status(401);
//     throw new Error("No token provided");
//   }

//   const token = authHeader.split(" ")[1];

//   const decoded = decodeToken(token);
//   const user = await User.findById(decoded.userId);

//   if (!user) {
//     res.status(401);
//     throw new Error("User not found");
//   }

//   req.user = user;

//   next();
// });

export const authToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("No token provided");
  }

  const decoded = decodeToken(token);
  const user = await User.findById(decoded.userId);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});
