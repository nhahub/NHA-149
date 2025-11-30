import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import upload from "../../utils/multer/cloud.multer.js";
import * as service from "./schedule.service.js";
import {
  createScheduleSchema,
  getSchedulesByDateSchema,
  scheduleIdSchema,
  updateScheduleSchema,
} from "./schedule.validation.js";

const router = express.Router();

// Public routes
router.get("/", service.getSchedules);
router.get(
  "/date/:date",
  validation(getSchedulesByDateSchema),
  service.getSchedulesByDate
);

// Protected routes
router.use(authenticate);

// Interviewer routes - MUST come before /:id route
router.get("/my", authorize("interviewer", "admin"), service.getMySchedules);
router.post(
  "/",
  authorize("interviewer", "admin"),
  validation(createScheduleSchema),
  service.createSchedule
);

// Public route with :id param - MUST come after specific routes like /my
router.get("/:id", validation(scheduleIdSchema), service.getScheduleById);
router.put(
  "/:id",
  authorize("interviewer", "admin"),
  validation(updateScheduleSchema),
  service.updateSchedule
);
router.put(
  "/:id/image",
  authorize("interviewer", "admin"),
  validation(scheduleIdSchema),
  upload.single("image"),
  service.uploadScheduleImage
);
router.delete(
  "/:id",
  authorize("interviewer", "admin"),
  validation(scheduleIdSchema),
  service.deleteSchedule
);

export default router;
