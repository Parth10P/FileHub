import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Something went wrong on the server" });
};
