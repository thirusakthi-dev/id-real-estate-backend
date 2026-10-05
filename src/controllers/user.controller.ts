import { Request, Response, NextFunction } from "express";
import { createUser, loginUser } from "../services/user.service.js";
import { success } from "zod";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body.email, req.body.password);

    return res.status(200).json({
      success: true,
      message: "Login Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
