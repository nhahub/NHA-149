import Joi from "joi";

export const createScheduleSchema = {
  body: Joi.object({
    date: Joi.date().required().min("now").messages({
      "date.base": "Date must be a valid date",
      "date.min": "Date must be in the future",
      "any.required": "Date is required",
    }),
    startTime: Joi.string()
      .required()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.empty": "Start time is required",
        "string.pattern.base": "Start time must be in HH:MM format",
      }),
    endTime: Joi.string()
      .required()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.empty": "End time is required",
        "string.pattern.base": "End time must be in HH:MM format",
      }),
    duration: Joi.number().required().min(15).max(180).messages({
      "number.base": "Duration must be a number",
      "number.min": "Duration must be at least 15 minutes",
      "number.max": "Duration cannot exceed 180 minutes",
    }),
    breakTime: Joi.number().min(0).max(60).default(15).messages({
      "number.min": "Break time cannot be negative",
      "number.max": "Break time cannot exceed 60 minutes",
    }),
    title: Joi.string().required().max(100).messages({
      "string.empty": "Title is required",
      "string.max": "Title cannot be more than 100 characters",
    }),
    description: Joi.string().max(500).allow("").messages({
      "string.max": "Description cannot be more than 500 characters",
    }),
  }),
};

export const updateScheduleSchema = {
  params: Joi.object({
    id: Joi.string().required().hex().length(24).messages({
      "string.empty": "Schedule ID is required",
      "string.length": "Schedule ID must be a valid MongoDB ObjectId",
    }),
  }),
  body: Joi.object({
    startTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format",
      }),
    endTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "End time must be in HH:MM format",
      }),
    duration: Joi.number().min(15).max(180).messages({
      "number.min": "Duration must be at least 15 minutes",
      "number.max": "Duration cannot exceed 180 minutes",
    }),
    breakTime: Joi.number().min(0).max(60).messages({
      "number.min": "Break time cannot be negative",
      "number.max": "Break time cannot exceed 60 minutes",
    }),
    title: Joi.string().max(100).messages({
      "string.max": "Title cannot be more than 100 characters",
    }),
    description: Joi.string().max(500).allow("").messages({
      "string.max": "Description cannot be more than 500 characters",
    }),
    isActive: Joi.boolean(),
  }),
};

export const scheduleIdSchema = {
  params: Joi.object({
    id: Joi.string().required().hex().length(24).messages({
      "string.empty": "Schedule ID is required",
      "string.length": "Schedule ID must be a valid MongoDB ObjectId",
    }),
  }),
};

export const getSchedulesByDateSchema = {
  params: Joi.object({
    date: Joi.date().required().messages({
      "date.base": "Date must be a valid date",
      "any.required": "Date is required",
    }),
  }),
};
