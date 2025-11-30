import Joi from "joi";
import { generalRules } from "../../utils/validation-rules.js";

// Schema for creating educational content
export const createEducationalContentSchema = {
  body: Joi.object({
    type: Joi.string().valid("faq", "tip", "article").required().messages({
      "any.only": "Type must be faq, tip, or article",
      "any.required": "Type is required",
    }),
    title: generalRules.bilingual("title").required(),
    content: generalRules.bilingual("content").required(),
    category: Joi.string()
      .valid(
        "frontend-development",
        "backend-development",
        "soft-skills",
        "interview-preparation",
        "career-development"
      )
      .required()
      .messages({
        "any.only": "Invalid category",
        "string.empty": "Category is required",
        "any.required": "Category is required",
      }),
    tags: generalRules.stringArray.optional(),
    featured: Joi.boolean().optional(),
    thumbnailUrl: Joi.string().uri().optional().allow("", null),
    references: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          title: Joi.string().optional().allow(""),
          description: Joi.string().optional().allow(""),
        })
      )
      .optional(),
    recommendedVideos: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          title: Joi.string().optional().allow(""),
          description: Joi.string().optional().allow(""),
        })
      )
      .optional(),
    isPublished: Joi.boolean().optional(),
  }),
};

// Schema for updating educational content
export const updateEducationalContentSchema = {
  params: generalRules.paramsWithId("Content ID"),
  body: Joi.object({
    type: Joi.string().valid("faq", "tip", "article").optional(),
    title: generalRules.bilingual("title").optional(),
    content: generalRules.bilingual("content").optional(),
    category: Joi.string()
      .valid(
        "frontend-development",
        "backend-development",
        "soft-skills",
        "interview-preparation",
        "career-development"
      )
      .optional(),
    tags: generalRules.stringArray.optional(),
    featured: Joi.boolean().optional(),
    thumbnailUrl: Joi.string().uri().optional().allow("", null),
    references: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          title: Joi.string().optional().allow(""),
          description: Joi.string().optional().allow(""),
        })
      )
      .optional(),
    recommendedVideos: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          title: Joi.string().optional().allow(""),
          description: Joi.string().optional().allow(""),
        })
      )
      .optional(),
    isPublished: Joi.boolean().optional(),
  }),
};

// Schema for bulk creating educational content
export const bulkCreateEducationalContentSchema = {
  body: Joi.object({
    content: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid("faq", "tip", "article")
            .required()
            .messages({
              "any.only": "Type must be faq, tip, or article",
              "any.required": "Type is required",
            }),
          title: generalRules.bilingual("title").required(),
          content: generalRules.bilingual("content").required(),
          category: Joi.string()
            .valid(
              "frontend-development",
              "backend-development",
              "soft-skills",
              "interview-preparation",
              "career-development"
            )
            .required()
            .messages({
              "any.only": "Invalid category",
              "string.empty": "Category is required",
              "any.required": "Category is required",
            }),
          tags: generalRules.stringArray.optional(),
          featured: Joi.boolean().optional(),
          thumbnailUrl: Joi.string().uri().optional().allow("", null),
          references: Joi.array()
            .items(
              Joi.object({
                url: Joi.string().uri().required(),
                title: Joi.string().optional().allow(""),
                description: Joi.string().optional().allow(""),
              })
            )
            .optional(),
          recommendedVideos: Joi.array()
            .items(
              Joi.object({
                url: Joi.string().uri().required(),
                title: Joi.string().optional().allow(""),
                description: Joi.string().optional().allow(""),
              })
            )
            .optional(),
          isPublished: Joi.boolean().optional(),
        })
      )
      .min(1)
      .max(100)
      .required()
      .messages({
        "array.min": "At least one content item is required",
        "array.max": "Cannot create more than 100 items at once",
        "any.required": "Content array is required",
      }),
  }),
};

// Schema for content ID in params
export const contentIdSchema = {
  params: generalRules.paramsWithId("Content ID"),
};
