import type { Response } from "express";
import type { ServerResponse } from "../types/responses/ServerResponse";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  error?: string,
  successOverride?: boolean
) => {
  const success = successOverride ?? (statusCode >= 200 && statusCode < 300);

  const response: ServerResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(error && { error }),
    status: statusCode,
  };

  return res.status(statusCode).json(response);
};

