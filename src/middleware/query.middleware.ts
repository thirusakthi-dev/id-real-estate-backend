import { Request, Response, NextFunction } from "express";

import { z } from "zod";

export const validateQuery = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.issues,
      });
    }

    Object.assign(req.query, result.data);

    next();
  };
};
