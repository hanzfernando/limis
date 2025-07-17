import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import { sendResponse } from "../utils/sendResponse";

export const getProfile = asyncHandler( async( req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  const { _id, email } = req.user!;

  sendResponse(res, 200, "User profile fetched successfully", {
    id: _id.toString(),
    email,
  });
  return
})