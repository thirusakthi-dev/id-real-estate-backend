import { Router } from "express";

import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate.middleware";

import {
  createPropertySchema,
  propertyQuerySchema,
  updatePropertySchema,
} from "../validators/property.validator";

import {
  createPropertyController,
  deletePropertyController,
  getPropertiesController,
  getPropertyController,
  updatePropertyController,
} from "../controllers/property.controller";

import { validateQuery } from "../middleware/query.middleware";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  validate(createPropertySchema),
  createPropertyController,
);

router.get("/", validateQuery(propertyQuerySchema), getPropertiesController);

router.get("/:id", getPropertyController);

router.put(
  "/:id",
  authenticate,
  upload.array("images", 10),
  validate(updatePropertySchema),
  updatePropertyController,
);

router.delete("/:id", authenticate, deletePropertyController);

export default router;
