import mongoose from "mongoose";

const daySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      unique: true,
    },
    title: {
      en: {
        type: String,
        required: [true, "English title is required"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Arabic title is required"],
        trim: true,
      },
    },
    description: {
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
daySchema.index({ isActive: 1 });

const Day = mongoose.models.Day || mongoose.model("Day", daySchema);

export default Day;
