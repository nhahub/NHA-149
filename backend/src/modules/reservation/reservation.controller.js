import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./reservation.service.js";
import {
  createReservationSchema,
  reservationIdSchema,
} from "./reservation.validation.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Candidate routes
router.post(
  "/",
  authorize("candidate"),
  validation(createReservationSchema),
  service.createReservation
);

// General routes
router.get("/me", service.getMyReservations);

// Interviewer routes
router.get(
  "/pending",
  authorize("interviewer", "admin"),
  service.getPendingReservations
);
router.post(
  "/:id/accept",
  authorize("interviewer", "admin"),
  validation(reservationIdSchema),
  service.acceptReservation
);
router.post(
  "/:id/reject",
  authorize("interviewer", "admin"),
  validation(reservationIdSchema),
  service.rejectReservation
);

export default router;
