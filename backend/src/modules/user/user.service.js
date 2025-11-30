import Schedule from "../../DB/models/schedule.model.js";
import User from "../../DB/models/user.model.js";
import { successResponse } from "../../utils/index.js";
import { destroyFile } from "../../utils/multer/cloudinary.js";

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10, role, search, isActive } = req.query;

  // Build query
  let query = {};

  if (role) {
    query.role = role;
  }

  if (isActive !== undefined) {
    // Handle both string and boolean values
    query.isActive = isActive === "true" || isActive === true;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  successResponse({
    res,
    message: "Users retrieved successfully",
    data: {
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  successResponse({
    res,
    message: "User retrieved successfully",
    data: { user },
  });
};

// @desc    Update current user profile
// @route   PUT /api/v1/users/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  const { name, language } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, language },
    { new: true, runValidators: true }
  );

  successResponse({
    res,
    message: "Profile updated successfully",
    data: { user },
  });
};

// @desc    Update user avatar
// @route   PUT /api/v1/users/me/avatar
// @access  Private
export const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    throw new Error("Please upload an image file", { cause: 400 });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: req.file.path },
    { new: true }
  );

  successResponse({
    res,
    message: "Avatar updated successfully",
    data: { user },
  });
};

// @desc    Deactivate user account
// @route   PUT /api/v1/users/me/deactivate
// @access  Private
export const deactivateAccount = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  successResponse({
    res,
    message: "Account deactivated successfully",
  });
};

// @desc    Get pending interviewers (Admin only)
// @route   GET /api/v1/users/pending-interviewers
// @access  Private/Admin
export const getPendingInterviewers = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    role: "interviewer",
    isApproved: false,
    isActive: true,
  };

  const interviewers = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  successResponse({
    res,
    message: "Pending interviewers retrieved successfully",
    data: {
      interviewers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};

// @desc    Approve interviewer (Admin only)
// @route   PUT /api/v1/users/:id/approve
// @access  Private/Admin
export const approveInterviewer = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  if (user.role !== "interviewer") {
    throw new Error("Only interviewers can be approved", { cause: 400 });
  }

  if (user.isApproved) {
    throw new Error("Interviewer is already approved", { cause: 400 });
  }

  user.isApproved = true;
  await user.save();

  successResponse({
    res,
    message: "Interviewer approved successfully",
    data: { user },
  });
};

// @desc    Get approved interviewers (For candidates to browse)
// @route   GET /api/v1/users/interviewers
// @access  Public
export const getInterviewers = async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    specialization,
    search,
    hasSchedules,
  } = req.query;

  let query = {
    role: "interviewer",
    isApproved: true,
    isActive: true,
  };

  if (specialization) {
    query.specialization = specialization;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // If hasSchedules is true, only return interviewers with active schedules
  if (hasSchedules === "true") {
    // Get interviewer IDs who have active schedules
    const activeSchedules = await Schedule.find({ isActive: true }).distinct(
      "interviewerId"
    );
    query._id = { $in: activeSchedules };
  }

  const interviewers = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  successResponse({
    res,
    message: "Interviewers retrieved successfully",
    data: {
      interviewers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};

// @desc    Reject interviewer (Admin only)
// @route   PUT /api/v1/users/:id/reject
// @access  Private/Admin
export const rejectInterviewer = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  if (user.role !== "interviewer") {
    throw new Error("Only interviewers can be rejected", { cause: 400 });
  }

  if (user.isApproved) {
    throw new Error("Cannot reject an already approved interviewer", {
      cause: 400,
    });
  }

  // Delete CV file from Cloudinary if exists
  if (user.cvPublicId) {
    try {
      await destroyFile({ publicId: user.cvPublicId });
    } catch (error) {
      // Log error but continue with user deletion
      console.error("Error deleting CV from Cloudinary:", error);
    }
  }

  // Delete the rejected interviewer from database
  await User.findByIdAndDelete(req.params.id);

  successResponse({
    res,
    message: "Interviewer rejected and removed successfully",
  });
};

// @desc    Update user (Admin only)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    email,
    role,
    language,
    isActive,
    isApproved,
    yearsOfExperience,
    specialization,
  } = req.body;

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  // Prevent changing own role or deactivating own account
  if (user._id.toString() === req.user._id.toString()) {
    if (role && role !== user.role) {
      throw new Error("Cannot change your own role", { cause: 400 });
    }
    if (isActive === false) {
      throw new Error("Cannot deactivate your own account", { cause: 400 });
    }
  }

  // Prevent changing admin role
  if (user.role === "admin" && role && role !== "admin") {
    throw new Error("Cannot change admin role", { cause: 400 });
  }

  // Prevent promoting to admin
  if (role === "admin" && user.role !== "admin") {
    throw new Error("Cannot promote user to admin", { cause: 400 });
  }

  // Update email if provided and different
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists && emailExists._id.toString() !== id) {
      throw new Error("Email already exists", { cause: 400 });
    }
  }

  // Build update object
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email.toLowerCase();
  if (role !== undefined) updateData.role = role;
  if (language !== undefined) updateData.language = language;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isApproved !== undefined) updateData.isApproved = isApproved;

  // Handle interviewer-specific fields
  if (role === "interviewer" || user.role === "interviewer") {
    if (yearsOfExperience !== undefined)
      updateData.yearsOfExperience = yearsOfExperience;
    if (specialization !== undefined) updateData.specialization = specialization;
    
    // If changing to interviewer, ensure required fields are set
    if (role === "interviewer" && user.role !== "interviewer") {
      if (!updateData.yearsOfExperience && !user.yearsOfExperience) {
        throw new Error("Years of experience is required for interviewers", {
          cause: 400,
        });
      }
      if (!updateData.specialization && !user.specialization) {
        throw new Error("Specialization is required for interviewers", {
          cause: 400,
        });
      }
    }
  } else if (role && role !== "interviewer") {
    // If changing from interviewer to another role, clear interviewer fields
    if (user.role === "interviewer") {
      updateData.yearsOfExperience = null;
      updateData.specialization = null;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  successResponse({
    res,
    message: "User updated successfully",
    data: { user: updatedUser },
  });
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  // Prevent deleting admin accounts
  if (user.role === "admin") {
    throw new Error("Cannot delete admin accounts", { cause: 400 });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw new Error("Cannot delete your own account", { cause: 400 });
  }

  // Delete CV file from Cloudinary if exists
  if (user.cvPublicId) {
    try {
      await destroyFile({ publicId: user.cvPublicId });
    } catch (error) {
      // Log error but continue with user deletion
      console.error("Error deleting CV from Cloudinary:", error);
    }
  }

  // Delete avatar from Cloudinary if exists
  if (user.avatarPublicId) {
    try {
      await destroyFile({ publicId: user.avatarPublicId });
    } catch (error) {
      // Log error but continue with user deletion
      console.error("Error deleting avatar from Cloudinary:", error);
    }
  }

  // Delete the user from database
  await User.findByIdAndDelete(req.params.id);

  successResponse({
    res,
    message: "User deleted successfully",
  });
};
