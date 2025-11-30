import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating an evaluation
export const createEvaluationSchema = {
  body: Joi.object({
    sessionId: generalRules.mongoId("Session ID").required(),
    criteria: Joi.object({
      communication: Joi.object({
        score: generalRules.rating("Communication score", 1, 10).required(),
        comment: Joi.string().max(500).allow("").optional(),
      }).required(),
      technical: Joi.object({
        score: generalRules.rating("Technical score", 1, 10).required(),
        comment: Joi.string().max(500).allow("").optional(),
      }).required(),
      problemSolving: Joi.object({
        score: generalRules.rating("Problem solving score", 1, 10).required(),
        comment: Joi.string().max(500).allow("").optional(),
      }).required(),
      confidence: Joi.object({
        score: generalRules.rating("Confidence score", 1, 10).required(),
        comment: Joi.string().max(500).allow("").optional(),
      }).required(),
    }).required(),
    notes: Joi.string().max(1000).allow("").optional(),
  }),
};

// Schema for updating an evaluation
export const updateEvaluationSchema = {
  params: generalRules.paramsWithId("Evaluation ID"),
  body: Joi.object({
    criteria: Joi.object({
      communication: Joi.object({
        score: generalRules.rating("Communication score", 1, 10).optional(),
        comment: Joi.string().max(500).allow("").optional(),
      }).optional(),
      technical: Joi.object({
        score: generalRules.rating("Technical score", 1, 10).optional(),
        comment: Joi.string().max(500).allow("").optional(),
      }).optional(),
      problemSolving: Joi.object({
        score: generalRules.rating("Problem solving score", 1, 10).optional(),
        comment: Joi.string().max(500).allow("").optional(),
      }).optional(),
      confidence: Joi.object({
        score: generalRules.rating("Confidence score", 1, 10).optional(),
        comment: Joi.string().max(500).allow("").optional(),
      }).optional(),
    }).optional(),
    notes: Joi.string().max(1000).allow("").optional(),
    isCompleted: Joi.boolean().optional(),
  }),
};

// Schema for getting evaluation by session ID
export const getEvaluationBySessionSchema = {
  params: generalRules.paramsWithSessionId,
};
