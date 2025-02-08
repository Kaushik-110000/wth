import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
    },
    certificate: {
      type: String, // Cloudinary URL
    },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);
