import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Conference } from "../models/conference.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createConference = asyncHandler(async (req, res) => {
  const { name, location, date, description, presentationLink } = req.body;

  if (!name || !location || !date || !description) {
    throw new ApiError(400, "Name, Location, Date, and Description are required");
  }

  const userId = req?.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  const conference = await Conference.create({
    recepient: userId,
    name,
    location,
    date,
    description,
    presentationLink,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, conference, "Conference created successfully"));
});

const getConferencesByUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(400, "User name is required");
  }

  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  const conferences = await Conference.aggregate([
    {
      $match: {
        recepient: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!conferences.length) {
    throw new ApiError(404, "Conferences not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, conferences, "Conferences retrieved successfully"));
});

const getOneConference = asyncHandler(async (req, res) => {
  const { conferenceId } = req.params;
  if (!conferenceId) {
    throw new ApiError(400, "Conference ID is required");
  }

  const conference = await Conference.findById(conferenceId);
  if (!conference) {
    throw new ApiError(404, "Conference not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, conference, "Conference retrieved successfully"));
});

const updateConference = asyncHandler(async (req, res) => {
  const { conferenceId } = req.params;
  if (!conferenceId) {
    throw new ApiError(400, "Conference ID is required");
  }

  const conference = await Conference.findById(conferenceId);
  if (!conference) {
    throw new ApiError(404, "Conference not found");
  }
  if (conference.recepient.toString()  != req.user._id.toString() ) {
    throw new ApiError(400, "No you cannot");
  }

  const { name, location, date, description, presentationLink } = req.body;

  const updatedConference = await Conference.findByIdAndUpdate(
    conferenceId,
    { name, location, date, description, presentationLink },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedConference, "Conference updated successfully"));
});

const deleteConference = asyncHandler(async (req, res) => {
  const { conferenceId } = req.params;
  if (!conferenceId) {
    throw new ApiError(400, "Conference ID is required");
  }

  const conference = await Conference.findById(conferenceId);
  if (!conference) {
    throw new ApiError(404, "Conference not found");
  }
  if (conference.recepient.toString()  != req.user._id.toString() ) {
    throw new ApiError(400, "No you cannot");
  }

  await Conference.findByIdAndDelete(conferenceId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Conference deleted successfully"));
});

export {
  createConference,
  getConferencesByUser,
  getOneConference,
  updateConference,
  deleteConference,
};
