import Joi from "joi";

/**
 * General reusable Joi validation rules
 * These are base rules without .required() - add it as needed in each module
 */
export const generalRules = {
  // MongoDB ObjectId validation (24-character hex string)
  mongoId: (fieldName = "ID") =>
    Joi.string()
      .hex()
      .length(24)
      .messages({
        "string.hex": `Invalid ${fieldName} format`,
        "string.length": `Invalid ${fieldName} format`,
      }),

  // Email validation
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),

  // Password validation with pattern
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "string.empty": "Password is required",
    }),

  // Simple password (for login - no pattern check)
  passwordSimple: Joi.string().messages({
    "string.empty": "Password is required",
  }),

  // Name validation
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 50 characters",
    "string.empty": "Name is required",
  }),

  // Language validation
  language: Joi.string().valid("en", "ar").messages({
    "any.only": "Language must be en or ar",
  }),

  // Role validation
  role: Joi.string().valid("candidate", "interviewer", "admin").messages({
    "any.only": "Role must be candidate, interviewer, or admin",
  }),

  // Time validation (HH:MM format)
  time: (fieldName = "Time") =>
    Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .messages({
        "string.pattern.base": `${fieldName} must be in HH:MM format`,
        "string.empty": `${fieldName} is required`,
      }),

  // Date validation (ISO format)
  date: Joi.date().iso().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format",
  }),

  // Rating validation (customizable min/max)
  rating: (fieldName = "Rating", min = 0, max = 10) =>
    Joi.number()
      .min(min)
      .max(max)
      .messages({
        "number.min": `${fieldName} must be at least ${min}`,
        "number.max": `${fieldName} must not exceed ${max}`,
      }),

  // Text/Comment validation (customizable length)
  text: (fieldName = "Text", minLength = 1, maxLength = 1000) =>
    Joi.string()
      .min(minLength)
      .max(maxLength)
      .messages({
        "string.min": `${fieldName} must be at least ${minLength} characters long`,
        "string.max": `${fieldName} must not exceed ${maxLength} characters`,
        "string.empty": `${fieldName} is required`,
      }),

  // Boolean validation
  boolean: Joi.boolean(),

  // Difficulty level validation
  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .messages({
      "any.only": "Difficulty must be beginner, intermediate, or advanced",
    }),

  // Bilingual field validation (for en/ar content)
  bilingual: (fieldName = "Field") =>
    Joi.object({
      en: Joi.string().messages({
        "string.empty": `English ${fieldName} is required`,
      }),
      ar: Joi.string().messages({
        "string.empty": `Arabic ${fieldName} is required`,
      }),
    }),

  // Array of strings validation
  stringArray: Joi.array().items(Joi.string()),

  // Common param schemas
  paramsWithId: (idFieldName = "ID") =>
    Joi.object({
      id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
          "string.hex": `Invalid ${idFieldName} format`,
          "string.length": `Invalid ${idFieldName} format`,
          "any.required": `${idFieldName} is required`,
        }),
    }),

  paramsWithSessionId: Joi.object({
    sessionId: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid Session ID format",
      "string.length": "Invalid Session ID format",
      "any.required": "Session ID is required",
    }),
  }),
};
