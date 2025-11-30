import Joi from "joi";
import { interviewerSpecializations } from "../../DB/models/user.model.js";
import { generalRules } from "../../utils/validation-rules.js";

// Joi schema for register validation
export const registerSchema = {
  body: Joi.object({
    name: generalRules.name.required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    role: generalRules.role.required(),
    language: generalRules.language.optional(),
    // Interviewer-specific fields
    yearsOfExperience: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .when("role", {
        is: "interviewer",
        then: Joi.required().messages({
          "any.required": "Years of experience is required for interviewers",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Years of experience is only allowed for interviewers",
        }),
      })
      .messages({
        "number.base": "Years of experience must be a number",
        "number.integer": "Years of experience must be an integer",
        "number.min": "Years of experience cannot be negative",
        "number.max": "Years of experience must not exceed 50",
      }),
    specialization: Joi.string()
      .valid(...Object.values(interviewerSpecializations))
      .when("role", {
        is: "interviewer",
        then: Joi.required().messages({
          "any.required": "Specialization is required for interviewers",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Specialization is only allowed for interviewers",
        }),
      })
      .messages({
        "any.only": `Specialization must be one of: ${Object.values(
          interviewerSpecializations
        ).join(", ")}`,
      }),
  }),
};

// Joi schema for login validation
export const loginSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.passwordSimple.required(),
  }),
};
