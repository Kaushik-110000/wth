import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Award } from "../models/award.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
const createAward = asyncHandler(async (req, res) => {
  const { title, organization, year } = req.body;

  if (!title || !organization || !year) {
    throw new ApiError(400, "Title, Organization, and Year are required");
  }

  const userId = req?.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  let certificateUrl = null;
  if (req?.file?.path) {
    const data = await uploadOnCloudinary(req.file.path);
    certificateUrl = data?.url;
  }

  const award = await Award.create({
    title,
    organization,
    year,
    certificate: certificateUrl,
    recepient: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, award, "Award created successfully"));
});

const getPersonAward = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(400, "User name is required");
  }
  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  const awards = await Award.aggregate([
    {
      $match: {
        recepient: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!awards) {
    throw new ApiError(404, "Awards not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, awards, "Award retrieved successfully"));
});

const updateAward = asyncHandler(async (req, res) => {
  const { awardId } = req.params;
  if (!awardId) {
    throw new ApiError(400, "Award ID is required");
  }

  const award = await Award.findById(awardId);
  if (!award) {
    throw new ApiError(404, "Award not found");
  }

  const { title, organization, year } = req.body;
  let certificateUrl = award.certificate;

  if (req?.file?.path) {
    if (certificateUrl) {
      await deleteFromCloudinary(certificateUrl);
    }
    const data = await uploadOnCloudinary(req.file.path);
    certificateUrl = data?.url;
  }

  const updatedAward = await Award.findByIdAndUpdate(
    awardId,
    { title, organization, year, certificate: certificateUrl },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAward, "Award updated successfully"));
});

const getOneaward = asyncHandler(async (req, res) => {
  const { awardId } = req.params;
  if (!awardId) {
    throw new ApiError(404, "Not found award");
  }
  const award = await Award.findById(awardId);
  if (!award) {
    throw new ApiError(404, "Not found");
  }
  return res.status(200).json(new ApiResponse(200, award, "Found award"));
});

const deleteAward = asyncHandler(async (req, res) => {
  const { awardId } = req.params;
  if (!awardId) {
    throw new ApiError(400, "Award ID is required");
  }

  const award = await Award.findById(awardId);
  if (!award) {
    throw new ApiError(404, "Award not found");
  }

  // Delete certificate from Cloudinary if exists
  if (award.certificate) {
    await deleteFromCloudinary(award.certificate);
  }

  await Award.findByIdAndDelete(awardId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Award deleted successfully"));
});

export { createAward, getPersonAward, updateAward, deleteAward, getOneaward };
