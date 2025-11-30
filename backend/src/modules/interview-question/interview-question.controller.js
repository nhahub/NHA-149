import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./interview-question.service.js";
import {
  getQuestionsBySpecializationSchema,
  markQuestionAsAskedSchema,
  createQuestionSchema,
  getSessionQuestionsSchema,
} from "./interview-question.validation.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// General routes
router.get(
  "/:specialization",
  validation(getQuestionsBySpecializationSchema),
  service.getQuestionsBySpecialization
);
router.get(
  "/session/:sessionId",
  validation(getSessionQuestionsSchema),
  service.getSessionQuestions
);

// Interviewer routes
router.post(
  "/session/:sessionId/ask",
  authorize("interviewer", "admin"),
  validation(markQuestionAsAskedSchema),
  service.markQuestionAsAsked
);
router.post(
  "/",
  authorize("interviewer", "admin"),
  validation(createQuestionSchema),
  service.createQuestion
);

export default router;





