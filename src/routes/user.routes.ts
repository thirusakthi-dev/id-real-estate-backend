import { Router } from "express";

import {
  registerUser,
  login,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/user.validator.js";

import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), login);

router.patch("/me", authenticate, updateProfile);

router.patch("/change-password", authenticate, changePassword);

export default router;
