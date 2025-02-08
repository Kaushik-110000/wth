import mongoose, { Schema } from "mongoose";

const teachingExperienceSchema = new Schema(
    {
      courseName: {
        type: String,
        required: true,
      },
      institution: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      syllabusFile: {
        type: String, // Optional file upload
      },
    },
    { timestamps: true }
  );
  
export const TeachingExperience = mongoose.model("TeachingExperience", teachingExperienceSchema);
