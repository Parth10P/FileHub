import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyToken } from "../utils/token";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication token is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (_error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
