import express from "express";
import { authenticate, optionalAuthenticate, authorize, validation } from "../../middleware/index.js";
import { cloudFileUpload, fileTypes } from "../../utils/multer/cloud.multer.js";
import * as service from "./learn.service.js";
import {
  contentIdSchema,
  createEducationalContentSchema,
  updateEducationalContentSchema,
  bulkCreateEducationalContentSchema,
} from "./learn.validation.js";

const router = express.Router();

// Multer configuration for image upload (for articles)
const uploadImage = cloudFileUpload({ typeNeeded: fileTypes.image });

// Public routes (with optional auth for admin access)
router.get("/", optionalAuthenticate, service.getEducationalContent);
router.get("/categories", service.getCategories);
router.get(
  "/:id",
  validation(contentIdSchema),
  service.getEducationalContentById
);

// Protected routes
router.use(authenticate);

// Admin routes
// Bulk create endpoint (JSON only - for bulk uploads via Insomnia)
router.post(
  "/bulk",
  authenticate,
  authorize("admin"),
  validation(bulkCreateEducationalContentSchema),
  service.bulkCreateEducationalContent
);

// Single create endpoint (supports both JSON and FormData - for dashboard)
// Middleware to handle both JSON and multipart/form-data
const handleUpload = (req, res, next) => {
  // If content-type is multipart/form-data, use multer
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return uploadImage.single("thumbnail")(req, res, next);
  }
  // Otherwise, skip multer and let express.json() handle it
  next();
};

router.post(
  "/",
  authenticate,
  authorize("admin"),
  handleUpload,
  validation(createEducationalContentSchema),
  service.createEducationalContent
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  handleUpload,
  validation(updateEducationalContentSchema),
  service.updateEducationalContent
);
router.delete(
  "/:id",
  authorize("admin"),
  validation(contentIdSchema),
  service.deleteEducationalContent
);
router.get("/stats", authorize("admin"), service.getContentStats);

export default router;
