import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import * as service from "./admin.service.js";
import { reservationIdSchema } from "../reservation/reservation.validation.js";
import { slotIdSchema } from "../slot/slot.validation.js";
import { sessionIdSchema } from "../session/session.validation.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize("admin"));

router.get("/dashboard", service.getDashboard);

// Reservations management
router.get("/reservations", service.getAllReservations);
router.delete("/reservations/:id", validation(reservationIdSchema), service.deleteReservation);

// Slots management
router.get("/slots", service.getAllSlots);
router.delete("/slots/:id", validation(slotIdSchema), service.deleteSlot);

// Sessions management
router.get("/sessions", service.getAllSessions);
router.delete("/sessions/:id", validation(sessionIdSchema), service.deleteSession);

export default router;

