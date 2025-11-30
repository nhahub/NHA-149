import express from "express";
import { authenticate, validation } from "../../middleware/index.js";
import { cloudFileUpload, fileTypes } from "../../utils/multer/cloud.multer.js";
import * as authService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = express.Router();

// Multer configuration for CV upload
const uploadCV = cloudFileUpload({ typeNeeded: fileTypes.document });

// Public routes
router.post(
  "/register",
  uploadCV.single("cv"),
  validation(registerSchema),
  authService.register
);
router.post("/login", validation(loginSchema), authService.login);

// Protected routes
router.get("/me", authenticate, authService.getMe);

export default router;
