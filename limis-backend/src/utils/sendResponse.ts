import type { Response } from "express";
import type { ServerResponse } from "../types/ServerResponse";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  error?: string
) => {
  const response: ServerResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== undefined && { data }),
    ...(error && { error }),
  };

  return res.status(statusCode).json(response);
};
