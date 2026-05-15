import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/sendResponse";

// POST /api/dev/hash-password
export const generateHashedPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    sendResponse(res, 400, "Password is required");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  sendResponse(res, 200, "Hashed password generated", { hashedPassword });
});
