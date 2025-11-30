import express from "express";

// Import module routes
import authRoutes from "./modules/auth/auth.controller.js";
import dayRoutes from "./modules/day/day.controller.js";
import evaluationRoutes from "./modules/evaluation/evaluation.controller.js";
import feedbackRoutes from "./modules/feedback/feedback.controller.js";
import interviewQuestionRoutes from "./modules/interview-question/interview-question.controller.js";
import learnRoutes from "./modules/learn/learn.controller.js";
import reservationRoutes from "./modules/reservation/reservation.controller.js";
import scheduleRoutes from "./modules/schedule/schedule.controller.js";
import sessionRoutes from "./modules/session/session.controller.js";
import slotRoutes from "./modules/slot/slot.controller.js";
import userRoutes from "./modules/user/user.controller.js";
import adminRoutes from "./modules/admin/admin.controller.js";

const router = express.Router();

// Welcome endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌟 Welcome to Taqyeem API! 🌟",
    description: "Bilingual Interview & Learning Platform",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      days: "/api/v1/days",
      schedules: "/api/v1/schedules",
      slots: "/api/v1/slots",
      reservations: "/api/v1/reservations",
      sessions: "/api/v1/sessions",
      evaluations: "/api/v1/evaluations",
      interviewQuestions: "/api/v1/interview-questions",
      feedbacks: "/api/v1/feedbacks",
      learn: "/api/v1/learn",
    },
    documentation: "Visit /health for API status",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Taqyeem API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/days", dayRoutes);
router.use("/api/v1/schedules", scheduleRoutes);
router.use("/api/v1/slots", slotRoutes);
router.use("/api/v1/reservations", reservationRoutes);
router.use("/api/v1/sessions", sessionRoutes);
router.use("/api/v1/evaluations", evaluationRoutes);
router.use("/api/v1/interview-questions", interviewQuestionRoutes);
router.use("/api/v1/feedbacks", feedbackRoutes);
router.use("/api/v1/learn", learnRoutes);
router.use("/api/v1/admin", adminRoutes);

export default router;
