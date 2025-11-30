import User from "../../DB/models/user.model.js";
import { successResponse } from "../../utils/index.js";
import { uploadFile } from "../../utils/multer/cloudinary.js";
import { generateTokens } from "../../utils/token/generateTokens.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const {
    name,
    email,
    password,
    role = "candidate",
    language = "en",
    yearsOfExperience,
    specialization,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email", { cause: 400 });
  }

  // Validate role-specific requirements
  if (role === "interviewer") {
    // CV is required for interviewers
    if (!req.file) {
      throw new Error("CV is required for interviewer registration", {
        cause: 400,
      });
    }
  } else {
    // CV is not allowed for non-interviewers
    if (req.file) {
      throw new Error("CV upload is only allowed for interviewers", {
        cause: 400,
      });
    }
  }

  // Prepare user data
  const userData = {
    name,
    email,
    password,
    role,
    language,
  };

  // Add interviewer-specific fields if role is interviewer
  if (role === "interviewer") {
    userData.yearsOfExperience = yearsOfExperience;
    userData.specialization = specialization;
  }

  // Create user first (without CV)
  const user = await User.create(userData);

  // Handle CV upload if file is provided (using user ID for folder organization)
  if (req.file) {
    const uploadResult = await uploadFile({
      file: req.file,
      filePath: `cvs/${user._id}`,
    });

    // Update user with CV information
    user.cvUrl = uploadResult.secure_url;
    user.cvPublicId = uploadResult.public_id;
    await user.save();
  }

  const message =
    role === "interviewer"
      ? "Registration successful. Your account is pending admin approval."
      : "User registered successfully";

  successResponse({
    res,
    message,
    data: {
      user,
    },
    status: 201,
  });
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists and include password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials", { cause: 401 });
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error("Account is deactivated", { cause: 401 });
  }

  // Check if user is approved (for interviewers)
  if (!user.isApproved) {
    throw new Error("Account is pending admin approval", { cause: 403 });
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials", { cause: 401 });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { access_token, refresh_token } = await generateTokens(user);

  // Remove password from response
  user.password = undefined;

  successResponse({
    res,
    message: "Login successful",
    data: {
      user,
      access_token,
      refresh_token,
    },
  });
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  successResponse({
    res,
    message: "User profile retrieved successfully",
    data: { user },
  });
};
