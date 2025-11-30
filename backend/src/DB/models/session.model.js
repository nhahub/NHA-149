import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
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
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: [true, "Reservation ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Session date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    actualStartTime: {
      type: String,
      default: null,
    },
    actualEndTime: {
      type: String,
      default: null,
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    meetingLink: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
    cancelledReason: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "Cancellation reason cannot be more than 500 characters",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
sessionSchema.index({ candidateId: 1 });
sessionSchema.index({ interviewerId: 1 });
sessionSchema.index({ reservationId: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ date: 1 });

    
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
