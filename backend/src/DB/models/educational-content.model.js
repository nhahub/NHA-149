import mongoose from "mongoose";

const educationalContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["article", "faq", "tip"],
      required: [true, "Content type is required"],
    },
    title: {
      en: {
        type: String,
        required: [true, "English title is required"],
        trim: true,
        maxlength: [200, "English title cannot be more than 200 characters"],
      },
      ar: {
        type: String,
        required: [true, "Arabic title is required"],
        trim: true,
        maxlength: [200, "Arabic title cannot be more than 200 characters"],
      },
    },
    content: {
      en: {
        type: String,
        required: [true, "English content is required"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Arabic content is required"],
        trim: true,
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "frontend-development",
        "backend-development",
        "soft-skills",
        "interview-preparation",
        "career-development",
      ],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    references: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
          default: "",
        },
        description: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],
    recommendedVideos: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
          default: "",
        },
        description: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author ID is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      en: {
        type: Number,
        default: 0, // in minutes
      },
      ar: {
        type: Number,
        default: 0, // in minutes
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
educationalContentSchema.index({ type: 1 });
educationalContentSchema.index({ category: 1 });
educationalContentSchema.index({ authorId: 1 });
educationalContentSchema.index({ isPublished: 1 });
educationalContentSchema.index({ featured: 1 });
educationalContentSchema.index({ tags: 1 });

// Text search index
educationalContentSchema.index({
  "title.en": "text",
  "title.ar": "text",
  "content.en": "text",
  "content.ar": "text",
  tags: "text",
});

// Calculate reading time before saving
educationalContentSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    // Rough calculation: 200 words per minute
    const enWords = this.content.en.split(/\s+/).length;
    const arWords = this.content.ar.split(/\s+/).length;

    this.readingTime.en = Math.ceil(enWords / 200);
    this.readingTime.ar = Math.ceil(arWords / 200);
  }
  next();
});

    
const EducationalContent = mongoose.models.EducationalContent || mongoose.model("EducationalContent", educationalContentSchema);
export default EducationalContent;
