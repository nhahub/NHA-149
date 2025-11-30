import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating a reservation
export const createReservationSchema = {
  body: Joi.object({
    slotId: generalRules.mongoId("Slot ID").required(),
    note: generalRules.text("Note", 1, 500).optional(),
  }),
};

// Schema for reservation ID in params
export const reservationIdSchema = {
  params: generalRules.paramsWithId("Reservation ID"),
};
