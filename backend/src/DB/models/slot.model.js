import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: [true, "Schedule ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer ID is required"],
    },
    status: {
      type: String,
      enum: ["available", "pending", "booked"],
      default: "available",
    },
    maxCandidates: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    currentCandidates: {
      type: Number,
      default: 0,
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
slotSchema.index({ date: 1 });
slotSchema.index({ scheduleId: 1 });
slotSchema.index({ interviewerId: 1 });
slotSchema.index({ status: 1 });
slotSchema.index({ scheduleId: 1, date: 1 });
slotSchema.index({ interviewerId: 1, status: 1 });

// Validate that end time is after start time
slotSchema.pre("save", function (next) {
  const start = this.startTime.split(":").map(Number);
  const end = this.endTime.split(":").map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  if (endMinutes <= startMinutes) {
    next(new Error("End time must be after start time"));
  } else {
    next();
  }
});

const Slot = mongoose.models.Slot || mongoose.model("Slot", slotSchema);

export default Slot;
