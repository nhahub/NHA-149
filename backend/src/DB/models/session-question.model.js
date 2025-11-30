import mongoose from "mongoose";

const sessionQuestionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session ID is required"],
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewQuestion",
      required: [true, "Question ID is required"],
    },
    askedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
sessionQuestionSchema.index({ sessionId: 1 });
sessionQuestionSchema.index({ questionId: 1 });

const SessionQuestion =
  mongoose.models.SessionQuestion ||
  mongoose.model("SessionQuestion", sessionQuestionSchema);

export default SessionQuestion;





