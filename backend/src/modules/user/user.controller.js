import express from "express";
import { authenticate, authorize, validation } from "../../middleware/index.js";
import upload from "../../utils/multer/cloud.multer.js";
import * as userService from "./user.service.js";
import {
  getUserByIdSchema,
  updateProfileSchema,
  updateUserSchema,
} from "./user.validation.js";

const router = express.Router();

// Public routes
router.get("/interviewers", userService.getInterviewers);

// All other routes are protected
router.use(authenticate);

// User management routes
router.get("/", authorize("admin"), userService.getUsers);
router.get(
  "/pending-interviewers",
  authorize("admin"),
  userService.getPendingInterviewers
);
router.get("/:id", validation(getUserByIdSchema), userService.getUserById);
router.put("/me", validation(updateProfileSchema), userService.updateProfile);
router.put("/me/avatar", upload.single("avatar"), userService.updateAvatar);
router.put("/me/deactivate", userService.deactivateAccount);
router.put("/:id/approve", authorize("admin"), userService.approveInterviewer);
router.put("/:id/reject", authorize("admin"), userService.rejectInterviewer);
router.put(
  "/:id",
  authorize("admin"),
  validation(updateUserSchema),
  userService.updateUser
);
router.delete(
  "/:id",
  authorize("admin"),
  validation(getUserByIdSchema),
  userService.deleteUser
);

export default router;
