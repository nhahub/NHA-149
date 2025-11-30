import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating feedback
export const createFeedbackSchema = {
  body: Joi.object({
    sessionId: generalRules.mongoId("Session ID").required(),
    rating: generalRules.rating("Rating", 1, 5).required(),
    comment: generalRules.text("Comment", 10, 1000).required(),
    isPublic: generalRules.boolean.optional(),
  }),
};

// Schema for updating feedback
export const updateFeedbackSchema = {
  params: generalRules.paramsWithId("Feedback ID"),
  body: Joi.object({
    rating: generalRules.rating("Rating", 1, 5).optional(),
    comment: generalRules.text("Comment", 10, 1000).optional(),
    isPublic: generalRules.boolean.optional(),
  }),
};

// Schema for feedback ID in params
export const feedbackIdSchema = {
  params: generalRules.paramsWithId("Feedback ID"),
};

// Schema for getting feedbacks by session ID
export const getFeedbacksBySessionSchema = {
  params: generalRules.paramsWithSessionId,
};
