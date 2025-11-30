import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const userRoles = {
  CANDIDATE: "candidate",
  INTERVIEWER: "interviewer",
  ADMIN: "admin",
};

export const interviewerSpecializations = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  FULLSTACK: "fullstack",
  MOBILE: "mobile",
  DEVOPS: "devops",
  DATA_SCIENCE: "data-science",
  AI_ML: "ai-ml",
  CYBERSECURITY: "cybersecurity",
  QA: "qa",
  UI_UX: "ui-ux",
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.CANDIDATE,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    // Interviewer-specific fields
    cvUrl: {
      type: String,

      default: null,
    },
    cvPublicId: {
      type: String,

      default: null,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
      max: [50, "Years of experience must not exceed 50"],
      required: function () {
        return this.role === userRoles.INTERVIEWER;
      },
    },
    specialization: {
      type: String,
      enum: Object.values(interviewerSpecializations),
      required: function () {
        return this.role === userRoles.INTERVIEWER;
      },
    },
    isApproved: {
      type: Boolean,
      default: function () {
        // Interviewers need admin approval, others are auto-approved
        return this.role !== userRoles.INTERVIEWER;
      },
    },
    language: {
      type: String,
      enum: ["en", "ar"],
      default: "en",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
