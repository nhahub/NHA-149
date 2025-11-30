import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot be more than 500 characters"],
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot be more than 500 characters"],
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    respondedBy: {
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
reservationSchema.index({ candidateId: 1 });
reservationSchema.index({ slotId: 1 });
reservationSchema.index({ interviewerId: 1 });
reservationSchema.index({ status: 1 });

// Ensure one reservation per candidate per slot
reservationSchema.index({ candidateId: 1, slotId: 1 }, { unique: true });

// Index to help query active reservations per candidate per interviewer
// (for one-slot-per-interviewer-per-candidate enforcement)
reservationSchema.index({ candidateId: 1, interviewerId: 1, status: 1 });


const Reservation = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
    

export default Reservation;
