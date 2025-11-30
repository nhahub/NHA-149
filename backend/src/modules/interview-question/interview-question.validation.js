import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for getting questions by specialization
export const getQuestionsBySpecializationSchema = {
  params: Joi.object({
    specialization: Joi.string()
      .valid(
        "frontend-development",
        "backend-development",
        "fullstack-development",
        "mobile-development",
        "devops",
        "data-science",
        "cybersecurity",
        "qa",
        "ui-ux"
      )
      .required()
      .messages({
        "any.only": "Invalid specialization",
        "any.required": "Specialization is required",
      }),
  }),
};

// Schema for getting session questions
export const getSessionQuestionsSchema = {
  params: generalRules.paramsWithId("Session ID"),
};

// Schema for marking question as asked
export const markQuestionAsAskedSchema = {
  params: generalRules.paramsWithId("Session ID"),
  body: Joi.object({
    questionId: generalRules.mongoId("Question ID").required(),
    notes: generalRules.text("Notes", 1, 500).optional(),
  }),
};

// Schema for creating question
export const createQuestionSchema = {
  body: Joi.object({
    specialization: Joi.string()
      .valid(
        "frontend-development",
        "backend-development",
        "fullstack-development",
        "mobile-development",
        "devops",
        "data-science",
        "cybersecurity",
        "qa",
        "ui-ux"
      )
      .required()
      .messages({
        "any.only": "Invalid specialization",
        "any.required": "Specialization is required",
      }),
    question: generalRules.bilingual("question").required(),
    category: Joi.string()
      .valid("technical", "behavioral", "problem-solving", "system-design")
      .optional(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    suggestedAnswer: generalRules.bilingual("answer").optional(),
  }),
};

