import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./evaluation.service.js";
import {
  createEvaluationSchema,
  getEvaluationBySessionSchema,
  updateEvaluationSchema,
} from "./evaluation.validation.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// General routes
router.get("/my", service.getMyEvaluations);
router.get("/stats", authorize("admin"), service.getEvaluationStats);

// Interviewer routes
router.post(
  "/",
  authorize("interviewer", "admin"),
  validation(createEvaluationSchema),
  service.createEvaluation
);
router.put(
  "/:id",
  authorize("interviewer", "admin"),
  validation(updateEvaluationSchema),
  service.updateEvaluation
);

// General routes
router.get(
  "/:sessionId",
  validation(getEvaluationBySessionSchema),
  service.getEvaluationBySession
);

export default router;
