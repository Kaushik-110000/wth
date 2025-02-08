import mongoose, { Schema } from "mongoose";
const collaborationSchema = new Schema(
  {
    partnerName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    relatedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);
export const Collaboration = mongoose.model(
  "Collaboration",
  collaborationSchema
);
