import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./day.service.js";
import {
  createDaySchema,
  dayIdSchema,
  updateDaySchema,
} from "./day.validation.js";

const router = express.Router();

// Public routes
router.get("/", service.getDays);
router.get("/:id", validation(dayIdSchema), service.getDayById);

// Protected routes
router.use(authenticate);

// Admin only routes
router.post(
  "/",
  authorize("admin"),
  validation(createDaySchema),
  service.createDay
);
router.put(
  "/:id",
  authorize("admin"),
  validation(updateDaySchema),
  service.updateDay
);
router.delete(
  "/:id",
  authorize("admin"),
  validation(dayIdSchema),
  service.deleteDay
);

export default router;
