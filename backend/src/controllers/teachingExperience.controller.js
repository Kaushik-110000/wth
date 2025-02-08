import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { TeachingExperience } from "../models/teachingExperience.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
const createTeachingExperience = asyncHandler(async (req, res) => {
  const { courseName, institution, year } = req.body;

  if (!courseName || !institution || !year) {
    throw new ApiError(400, "Course Name, Institution, and Year are required");
  }

  const userId = req?.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  let syllabusFile = null;
  if (req?.file?.path) {
    const data = await uploadOnCloudinary(req.file.path);
    syllabusFile = data?.url;
  }

  const teachingExperience = await TeachingExperience.create({
    recepient: userId,
    courseName,
    institution,
    year,
    syllabusFile,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, teachingExperience, "Teaching Experience created successfully"));
});

const getTeachingExperienceByUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(400, "User name is required");
  }

  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  const teachingExperiences = await TeachingExperience.aggregate([
    {
      $match: {
        recepient: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!teachingExperiences.length) {
    throw new ApiError(404, "Teaching Experience not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachingExperiences, "Teaching Experiences retrieved successfully"));
});

const getOneTeachingExperience = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;
  if (!experienceId) {
    throw new ApiError(400, "Experience ID is required");
  }

  const teachingExperience = await TeachingExperience.findById(experienceId);
  if (!teachingExperience) {
    throw new ApiError(404, "Teaching Experience not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachingExperience, "Teaching Experience retrieved successfully"));
});

const updateTeachingExperience = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;
  if (!experienceId) {
    throw new ApiError(400, "Experience ID is required");
  }

  const teachingExperience = await TeachingExperience.findById(experienceId);
  if (!teachingExperience) {
    throw new ApiError(404, "Teaching Experience not found");
  }

  const { courseName, institution, year } = req.body;
  let syllabusFile = teachingExperience.syllabusFile;

  if (req?.file?.path) {
    if (syllabusFile) {
      await deleteFromCloudinary(syllabusFile);
    }
    const data = await uploadOnCloudinary(req.file.path);
    syllabusFile = data?.url;
  }

  const updatedTeachingExperience = await TeachingExperience.findByIdAndUpdate(
    experienceId,
    { courseName, institution, year, syllabusFile },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTeachingExperience, "Teaching Experience updated successfully"));
});

const deleteTeachingExperience = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;
  if (!experienceId) {
    throw new ApiError(400, "Experience ID is required");
  }

  const teachingExperience = await TeachingExperience.findById(experienceId);
  if (!teachingExperience) {
    throw new ApiError(404, "Teaching Experience not found");
  }

  if (teachingExperience.syllabusFile) {
    await deleteFromCloudinary(teachingExperience.syllabusFile);
  }

  await TeachingExperience.findByIdAndDelete(experienceId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Teaching Experience deleted successfully"));
});

export {
  createTeachingExperience,
  getTeachingExperienceByUser,
  getOneTeachingExperience, 
  updateTeachingExperience,
  deleteTeachingExperience,
};
