import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(error);

  // Prisma: Record not found / invalid operation
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });

      case "P2002":
        return res.status(409).json({
          success: false,
          message: "A record with this value already exists",
        });

      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Related record does not exist",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Database operation failed",
        });
    }
  }

  // Prisma validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid data provided",
    });
  }

  // Normal application error
  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
