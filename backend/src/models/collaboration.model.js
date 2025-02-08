import mongoose, { Schema } from "mongoose";
const collaborationSchema = new Schema(
  {
    partnerName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    recepient: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
