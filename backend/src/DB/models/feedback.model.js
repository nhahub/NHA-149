import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session ID is required"],
    },
    text: {
      type: String,
      required: [true, "Feedback text is required"],
      trim: true,
      maxlength: [2000, "Feedback cannot be more than 2000 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    feedbackType: {
      type: String,
      enum: ["general", "technical", "behavioral", "improvement"],
      default: "general",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
feedbackSchema.index({ sessionId: 1 });
feedbackSchema.index({ createdBy: 1 });
feedbackSchema.index({ feedbackType: 1 });

    
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
