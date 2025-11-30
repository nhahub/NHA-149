import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session ID is required"],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer ID is required"],
    },
    criteria: {
      communication: {
        score: {
          type: Number,
          required: [true, "Communication score is required"],
          min: [1, "Score must be at least 1"],
          max: [10, "Score cannot exceed 10"],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: [
            500,
            "Communication comment cannot be more than 500 characters",
          ],
        },
      },
      technical: {
        score: {
          type: Number,
          required: [true, "Technical score is required"],
          min: [1, "Score must be at least 1"],
          max: [10, "Score cannot exceed 10"],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: [
            500,
            "Technical comment cannot be more than 500 characters",
          ],
        },
      },
      problemSolving: {
        score: {
          type: Number,
          required: [true, "Problem solving score is required"],
          min: [1, "Score must be at least 1"],
          max: [10, "Score cannot exceed 10"],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: [
            500,
            "Problem solving comment cannot be more than 500 characters",
          ],
        },
      },
      confidence: {
        score: {
          type: Number,
          required: [true, "Confidence score is required"],
          min: [1, "Score must be at least 1"],
          max: [10, "Score cannot exceed 10"],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: [
            500,
            "Confidence comment cannot be more than 500 characters",
          ],
        },
      },
    },
    overallScore: {
      type: Number,
      required: [true, "Overall score is required"],
      min: [1, "Overall score must be at least 1"],
      max: [10, "Overall score cannot exceed 10"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
    evaluationType: {
      type: String,
      enum: ["manual", "ai"],
      default: "manual",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
evaluationSchema.index({ candidateId: 1 });
evaluationSchema.index({ interviewerId: 1 });
evaluationSchema.index({ overallScore: 1 });

// Ensure one evaluation per session
evaluationSchema.index({ sessionId: 1 }, { unique: true });

// Calculate overall score before saving
evaluationSchema.pre("save", function (next) {
  // Always calculate overallScore if criteria exists (for both new and updated documents)
  if (this.criteria && 
      this.criteria.communication?.score !== undefined &&
      this.criteria.technical?.score !== undefined &&
      this.criteria.problemSolving?.score !== undefined &&
      this.criteria.confidence?.score !== undefined) {
    const scores = [
      this.criteria.communication.score,
      this.criteria.technical.score,
      this.criteria.problemSolving.score,
      this.criteria.confidence.score,
    ];
    this.overallScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  }
  next();
});

    
const Evaluation = mongoose.models.Evaluation || mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;
