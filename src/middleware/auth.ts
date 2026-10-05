import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { success } from "zod";
import de from "zod/v4/locales/de.cjs";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid or expire token",
    });
  }
}
