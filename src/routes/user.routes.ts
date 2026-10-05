import { Router } from "express";
import { registerUser, login } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/user.validator.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), login);

export default router;
