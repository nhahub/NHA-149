import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer ID is required"],
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
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [180, "Duration cannot exceed 180 minutes"],
    },
    breakTime: {
      type: Number,
      default: 15,
      min: [0, "Break time cannot be negative"],
      max: [60, "Break time cannot exceed 60 minutes"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
scheduleSchema.index({ interviewerId: 1 });
scheduleSchema.index({ date: 1 });
scheduleSchema.index({ isActive: 1 });

// Ensure one schedule per interviewer per date
scheduleSchema.index({ interviewerId: 1, date: 1 }, { unique: true });

// Validate that end time is after start time
scheduleSchema.pre("save", function (next) {
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

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

export default Schedule;
