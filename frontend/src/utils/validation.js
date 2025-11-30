import { z } from "zod";

/**
 * Frontend validation rules matching backend Joi validation
 * These provide client-side validation before sending data to the server
 *
 * Note: These schemas use a translation function that should be passed from the component
 * For react-hook-form integration, use the createValidationSchemas function
 */

/**
 * Create validation schemas with translations
 * @param {Function} t - Translation function from useTranslation hook
 * @returns {Object} Object containing all validation schemas
 */
export const createValidationSchemas = (t) => {
  // Email validation
  const emailSchema = z
    .string()
    .min(1, t("validation.emailRequired"))
    .email(t("validation.email"));

  // Password validation with pattern (for registration)
  const passwordSchema = z
    .string()
    .min(6, t("validation.password"))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("validation.passwordComplex"));

  // Simple password (for login - no pattern check)
  const passwordSimpleSchema = z
    .string()
    .min(1, t("validation.passwordRequired"));

  // Name validation
  const nameSchema = z
    .string()
    .min(2, t("validation.nameMin"))
    .max(50, t("validation.nameMax"));

  // Role validation
  const roleSchema = z.enum(["candidate", "interviewer", "admin"], {
    errorMap: () => ({ message: t("validation.invalidRole") }),
  });

  // Language validation
  const languageSchema = z.enum(["en", "ar"], {
    errorMap: () => ({ message: t("validation.invalidLanguage") }),
  });

  // Specialization validation
  const specializationSchema = z.enum(
    [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "devops",
      "data-science",
      "ai-ml",
      "cybersecurity",
      "qa",
      "ui-ux",
    ],
    {
      errorMap: () => ({ message: t("validation.specializationRequired") }),
    }
  );

  // Years of experience validation
  const yearsOfExperienceSchema = z
    .number({
      required_error: t("validation.yearsOfExperienceRequired"),
      invalid_type_error: t("validation.yearsOfExperienceNumber"),
    })
    .int(t("validation.yearsOfExperienceInteger"))
    .min(0, t("validation.yearsOfExperienceMin"))
    .max(50, t("validation.yearsOfExperienceMax"));

  // Registration validation schema
  const registerSchema = z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z
        .string()
        .min(1, t("validation.confirmPasswordRequired")),
      role: roleSchema,
      language: languageSchema.optional(),
      // Interviewer-specific fields (conditional validation in component)
      yearsOfExperience: yearsOfExperienceSchema.optional(),
      specialization: specializationSchema.optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  // Login validation schema
  const loginSchema = z.object({
    email: emailSchema,
    password: passwordSimpleSchema,
  });

  // Profile update validation schema
  const profileUpdateSchema = z.object({
    name: nameSchema.optional(),
    bio: z
      .string()
      .max(500, t("validation.maxLength", { max: 500 }))
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, t("validation.email"))
      .optional()
      .or(z.literal("")),
    language: languageSchema.optional(),
  });

  // Password change validation schema
  const passwordChangeSchema = z
    .object({
      currentPassword: passwordSimpleSchema,
      newPassword: passwordSchema,
      confirmNewPassword: z
        .string()
        .min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmNewPassword"],
    });

  // Time validation (HH:MM format)
  const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format");

  // Date validation
  const dateSchema = z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: "Date must be a valid date" }
  );

  // Rating validation
  const ratingSchema = (min = 0, max = 10) =>
    z
      .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
      })
      .min(min, `Rating must be at least ${min}`)
      .max(max, `Rating must not exceed ${max}`);

  // Text/Comment validation
  const textSchema = (minLength = 1, maxLength = 1000) =>
    z
      .string()
      .min(minLength, `Must be at least ${minLength} characters long`)
      .max(maxLength, `Must not exceed ${maxLength} characters`);

  // Feedback validation schema
  const feedbackSchema = z.object({
    comment: textSchema(10, 1000),
    rating: ratingSchema(1, 5),
    isPublic: z.boolean().optional(),
  });

  // Evaluation validation schema
  const evaluationSchema = z.object({
    technicalSkills: ratingSchema(0, 10),
    communication: ratingSchema(0, 10),
    problemSolving: ratingSchema(0, 10),
    overallPerformance: ratingSchema(0, 10),
    strengths: textSchema(10, 500),
    improvements: textSchema(10, 500),
    notes: textSchema(10, 1000).optional().or(z.literal("")),
  });

  // Learning content validation schema
  const learningContentSchema = z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters long")
      .max(200, "Title must not exceed 200 characters"),
    content: textSchema(50, 10000),
    category: z.string().min(1, "Category is required"),
    difficulty: z.enum(["beginner", "intermediate", "advanced"], {
      errorMap: () => ({ message: "Please select a valid difficulty level" }),
    }),
    tags: z.array(z.string()).optional(),
    language: languageSchema,
  });

  return {
    emailSchema,
    passwordSchema,
    passwordSimpleSchema,
    nameSchema,
    roleSchema,
    languageSchema,
    specializationSchema,
    yearsOfExperienceSchema,
    registerSchema,
    loginSchema,
    profileUpdateSchema,
    passwordChangeSchema,
    timeSchema,
    dateSchema,
    ratingSchema,
    textSchema,
    feedbackSchema,
    evaluationSchema,
    learningContentSchema,
  };
};

// File validation helper
export const validateFile = (file, options = {}, t = null) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions = [".pdf", ".doc", ".docx"],
  } = options;

  if (!file) {
    return {
      valid: false,
      error: t ? t("validation.fileRequired") : "File is required",
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: t
        ? t("validation.fileSizeExceeded", { size: sizeMB })
        : `File size must be less than ${sizeMB}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const extensions = allowedExtensions.join(", ");
    return {
      valid: false,
      error: t
        ? t("validation.fileTypeInvalid", { types: extensions })
        : `Please upload a valid file (${extensions})`,
    };
  }

  return { valid: true };
};
