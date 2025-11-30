import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import upload from "../../utils/multer/cloud.multer.js";
import * as sessionService from "./session.service.js";
import { sessionIdSchema } from "./session.validation.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// General routes
router.get("/me", sessionService.getMySessions);
router.get("/:id", validation(sessionIdSchema), sessionService.getSessionById);

// Interviewer routes
router.post(
  "/:id/start",
  authorize("interviewer", "admin"),
  validation(sessionIdSchema),
  sessionService.startSession
);
router.post(
  "/:id/recording",
  authorize("interviewer", "admin"),
  validation(sessionIdSchema),
  upload.single("recording"),
  sessionService.uploadRecording
);
router.post(
  "/:id/complete",
  authorize("interviewer", "admin"),
  validation(sessionIdSchema),
  sessionService.completeSession
);

// General routes
router.post(
  "/:id/cancel",
  validation(sessionIdSchema),
  sessionService.cancelSession
);

export default router;
