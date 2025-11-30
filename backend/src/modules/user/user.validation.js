import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for updating user profile
export const updateProfileSchema = {
  body: Joi.object({
    name: generalRules.name.optional(),
    language: generalRules.language.optional(),
  }),
};

// Schema for admin updating user
export const updateUserSchema = {
  body: Joi.object({
    name: generalRules.name.optional(),
    email: generalRules.email.optional(),
    role: generalRules.role.optional(),
    language: generalRules.language.optional(),
    isActive: generalRules.boolean.optional(),
    isApproved: generalRules.boolean.optional(),
    yearsOfExperience: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .optional()
      .messages({
        "number.base": "Years of experience must be a number",
        "number.integer": "Years of experience must be an integer",
        "number.min": "Years of experience cannot be negative",
        "number.max": "Years of experience must not exceed 50",
      }),
    specialization: Joi.string()
      .valid(
        "frontend",
        "backend",
        "fullstack",
        "mobile",
        "devops",
        "data-science",
        "ai-ml",
        "cybersecurity",
        "qa",
        "ui-ux"
      )
      .optional()
      .messages({
        "any.only": "Please select a valid specialization",
      }),
  }),
};

// Schema for getting user by ID
export const getUserByIdSchema = {
  params: generalRules.paramsWithId("User ID"),
};
