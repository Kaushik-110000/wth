import mongoose, { Schema } from "mongoose";

const researchPaperSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    journal: {
      type: String,
    },
    pdfFile: {
      type: String, // Cloudinary URL
    },
    tags: [String],
  },
  { timestamps: true }
);

export const ReasearchPaper = mongoose.model(
  "ReasearchPaper",
  researchPaperSchema
);
