import express from "express";
import { authenticate, validation } from "../../middleware/index.js";
import * as service from "./feedback.service.js";
import {
  createFeedbackSchema,
  feedbackIdSchema,
  getFeedbacksBySessionSchema,
  updateFeedbackSchema,
} from "./feedback.validation.js";

const router = express.Router();

// Public routes
router.get("/public", service.getPublicFeedbacks);

// Protected routes
router.use(authenticate);

// General routes
router.post("/", validation(createFeedbackSchema), service.createFeedback);
router.get("/my", service.getMyFeedbacks);
router.put("/:id", validation(updateFeedbackSchema), service.updateFeedback);
router.delete("/:id", validation(feedbackIdSchema), service.deleteFeedback);

// General routes
router.get(
  "/:sessionId",
  validation(getFeedbacksBySessionSchema),
  service.getFeedbacksBySession
);

export default router;
