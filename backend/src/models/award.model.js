import mongoose, { Schema } from "mongoose";

const awardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    certificate: {
      type: String, 
    },
  },
  { timestamps: true }
);

export const Award = mongoose.model("Award", awardSchema);
