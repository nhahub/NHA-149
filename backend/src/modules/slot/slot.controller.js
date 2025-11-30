import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./slot.service.js";
import {
  createSlotSchema,
  getSlotsByDaySchema,
  slotIdSchema,
  updateSlotSchema,
} from "./slot.validation.js";

const router = express.Router();

// Public routes
router.get("/interviewer/:interviewerId", service.getSlotsByInterviewer);
router.get("/:dayId", validation(getSlotsByDaySchema), service.getSlotsByDay);

// Protected routes
router.use(authenticate);

// Interviewer routes
router.post(
  "/",
  authorize("interviewer", "admin"),
  validation(createSlotSchema),
  service.createSlot
);
router.get("/my", authorize("interviewer", "admin"), service.getMySlots);
router.put(
  "/:id",
  authorize("interviewer", "admin"),
  validation(updateSlotSchema),
  service.updateSlot
);
router.delete(
  "/:id",
  authorize("interviewer", "admin"),
  validation(slotIdSchema),
  service.deleteSlot
);

export default router;
