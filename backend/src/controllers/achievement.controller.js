import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Achievement } from "../models/achievement.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    throw new ApiError(400, "Title, Description, and Date are required");
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

  const achievement = await Achievement.create({
    title,
    description,
    date,
    certificate: certificateUrl,
    recepient: userId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, achievement, "Achievement created successfully")
    );
});

const getPersonAchievements = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(400, "User name is required");
  }

  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  const achievements = await Achievement.aggregate([
    {
      $match: {
        recepient: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!achievements) {
    throw new ApiError(404, "Achievements not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, achievements, "Achievements retrieved successfully")
    );
});

const updateAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(400, "Achievement ID is required");
  }

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new ApiError(404, "Achievement not found");
  }

  if (achievement.recepient.toString() != req.user._id.toString() ) {
    throw new ApiError(400, "No you cannot");
  }

  const { title, description, date } = req.body;
  let certificateUrl = achievement.certificate;

  if (req?.file?.path) {
    if (certificateUrl) {
      await deleteFromCloudinary(certificateUrl);
    }
    const data = await uploadOnCloudinary(req.file.path);
    certificateUrl = data?.url;
  }

  const updatedAchievement = await Achievement.findByIdAndUpdate(
    achievementId,
    { title, description, date, certificate: certificateUrl },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAchievement,
        "Achievement updated successfully"
      )
    );
});

const getOneAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(404, "Achievement ID is required");
  }
  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new ApiError(404, "Achievement not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, achievement, "Achievement found"));
});

const deleteAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(400, "Achievement ID is required");
  }

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new ApiError(404, "Achievement not found");
  }
  if (achievement.recepient.toString()  != req.user._id.toString() ) {
    throw new ApiError(400, "No you cannot");
  }

  if (achievement.certificate) {
    await deleteFromCloudinary(achievement.certificate);
  }

  await Achievement.findByIdAndDelete(achievementId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Achievement deleted successfully"));
});

export {
  createAchievement,
  getPersonAchievements,
  updateAchievement,
  deleteAchievement,
  getOneAchievement,
};
