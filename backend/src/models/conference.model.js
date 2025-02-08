import mongoose, { Schema } from "mongoose";

const conferenceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    presentationLink: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Conference = mongoose.model("Conference", conferenceSchema);
