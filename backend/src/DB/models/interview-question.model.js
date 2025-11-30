import mongoose from "mongoose";
import { interviewerSpecializations } from "./user.model.js";

const interviewQuestionSchema = new mongoose.Schema(
  {
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      enum: Object.values(interviewerSpecializations),
    },
    question: {
      en: {
        type: String,
        required: [true, "English question is required"],
        trim: true,
        maxlength: [500, "Question cannot be more than 500 characters"],
      },
      ar: {
        type: String,
        required: [true, "Arabic question is required"],
        trim: true,
        maxlength: [500, "Question cannot be more than 500 characters"],
      },
    },
    category: {
      type: String,
      enum: ["technical", "behavioral", "problem-solving", "system-design"],
      default: "technical",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    suggestedAnswer: {
      en: {
        type: String,
        trim: true,
        maxlength: [1000, "Answer cannot be more than 1000 characters"],
      },
      ar: {
        type: String,
        trim: true,
        maxlength: [1000, "Answer cannot be more than 1000 characters"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
interviewQuestionSchema.index({ specialization: 1, isActive: 1 });
interviewQuestionSchema.index({ category: 1 });
interviewQuestionSchema.index({ difficulty: 1 });

const InterviewQuestion =
  mongoose.models.InterviewQuestion ||
  mongoose.model("InterviewQuestion", interviewQuestionSchema);

export default InterviewQuestion;
