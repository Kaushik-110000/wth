import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    technologiesUsed: [String],
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    githubLink: {
      type: String,
    },
    media: [String], 
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
