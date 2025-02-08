import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
  {
    recepient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    certificate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);
