import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating a day
export const createDaySchema = {
  body: Joi.object({
    date: generalRules.date.required(),
    isAvailable: generalRules.boolean.optional(),
  }),
};

// Schema for updating a day
export const updateDaySchema = {
  params: generalRules.paramsWithId("Day ID"),
  body: Joi.object({
    date: generalRules.date.optional(),
    isAvailable: generalRules.boolean.optional(),
  }),
};

// Schema for day ID in params
export const dayIdSchema = {
  params: generalRules.paramsWithId("Day ID"),
};
