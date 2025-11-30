import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating a slot
export const createSlotSchema = {
  body: Joi.object({
    dayId: generalRules.mongoId("Day ID").required(),
    startTime: generalRules.time("Start time").required(),
    endTime: generalRules.time("End time").required(),
    isAvailable: generalRules.boolean.optional(),
  }),
};

// Schema for updating a slot
export const updateSlotSchema = {
  params: generalRules.paramsWithId("Slot ID"),
  body: Joi.object({
    startTime: generalRules.time("Start time").optional(),
    endTime: generalRules.time("End time").optional(),
    isAvailable: generalRules.boolean.optional(),
  }),
};

// Schema for slot ID in params
export const slotIdSchema = {
  params: generalRules.paramsWithId("Slot ID"),
};

// Schema for getting slots by day ID
export const getSlotsByDaySchema = {
  params: Joi.object({
    dayId: generalRules.mongoId("Day ID").required(),
  }),
};
