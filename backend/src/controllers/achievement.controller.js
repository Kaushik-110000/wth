import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Achievement } from "../models/achievement.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    throw new ApiError("All fields are necessary");
  }

  const certificateLocalPath = req.files.certificate[0].path;
  if (!certificateLocalPath) {
    throw new ApiError(400, "Upload the certificate");
  }

  const certificate = await uploadOnCloudinary(certificateLocalPath);

  if (!certificate) {
    throw new ApiError(504, "Certificate cannot be uploaded");
  }
  const achievement = await Achievement.create({
    title,
    description,
    date,
    certificate,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, achievement, "Achievement recorded"));
});

const deleteAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(404, "achievement id is missing");
  }
  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new ApiError("Achievement cannot be found");
  }
});

const updateAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(404, "achievement id is missing");
  }

  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    throw new ApiError("All fields are necessary");
  }

  const certificateLocalPath = req.files.certificate[0].path;
  if (!certificateLocalPath) {
    throw new ApiError(400, "Upload the certificate");
  }

  const certificate = await uploadOnCloudinary(certificateLocalPath);

  if (!certificate) {
    throw new ApiError(504, "Certificate cannot be uploaded");
  }

  const achievement = await Achievement.findByIdAndUpdate(
    achievementId,
    {
      $set: {
        title,
        description,
        certificate,
        date,
      },
    },
    {
      new: true,
    }
  );

  if (!achievement) {
    throw new ApiError(404, "Achievement cannot be updated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, achievement, "Achievement updated"));
});

const getAchievement = asyncHandler(async (req, res) => {
  const { achievementId } = req.params;
  if (!achievementId) {
    throw new ApiError(404, "achievement id is missing");
  }
  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new ApiError(404, "Achievement cannot be found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, achievement, "Achievement found"));
});

export {
  createAchievement,
  deleteAchievement,
  updateAchievement,
  getAchievement,
};
