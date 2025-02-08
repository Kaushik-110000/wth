import mongoose, { Schema } from "mongoose";

const conferenceSchema = new Schema(
  {
    recepient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    presentationLink: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Conference = mongoose.model("Conference", conferenceSchema);
