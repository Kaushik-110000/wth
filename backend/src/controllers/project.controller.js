import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import fs from "fs";
const uploadProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    technologiesUsed,
    teamMembers,
    githubLink,
  } = req.body;
  const userId = req.user?._id.toString();
  if (!title || !description) {
    throw new ApiError(400, "Title and description are necessary");
  }

  //   console.log("F", req.files);
  const medias = req.files?.map((file) => file.path) || null;
  console.log(medias);

  const mediaUrls = await Promise.all(
    medias.map(async (media) => {
      const data = await uploadOnCloudinary(media);
      return data?.url;
    })
  );
  console.log(mediaUrls);
  const project = await Project.create({
    title,
    description,
    startDate: startDate || null,
    endDate: endDate || null,
    technologiesUsed: technologiesUsed || null,
    teamMembers: [teamMembers, userId],
    githubLink: githubLink || null,
    media: mediaUrls || null,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project posted successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(401, "Project id is missing");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  console.log(project);
  const { media } = project;
  if (media.length > 0) {
    await Promise.all(
      media.map(async (media) => {
        return await deleteFromCloudinary(media);
      })
    );
  }
  await Project.findByIdAndDelete(projectId);

  return res.status(200).json(new ApiResponse(200, {}, "Successfully deleted"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(401, "Project id is missing");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Titile or description empty");
  }
  const medias = req.files?.map((file) => file.path) || null;
  console.log(medias);

  const mediaUrls = await Promise.all(
    medias.map(async (media) => {
      const data = await uploadOnCloudinary(media);
      return data?.url;
    })
  );

  const data = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        title,
        description,
        media: mediaUrls,
      },
    },
    {
      new: true,
    }
  );

  if (!data) {
    throw new ApiError(404, "Error while updating the post ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Data updated successfully"));
});

const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(401, "Project id is missing");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project cannot be found");
  }
  return res.status(200).json(new ApiResponse(200, project, "Project found"));
});

const getAll = asyncHandler(async (req, res) => {
  const { userName } = req.params; // Extract userName from req.params

  if (!userName) {
    throw new ApiError(404, "Username not present");
  }

  // Corrected query to find user
  const user = await User.findOne({ userName: userName.trim() });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  console.log(userId, user._id);
  // Corrected aggregate pipeline
  const projects = await Project.aggregate([
    {
      $match: {
        teamMembers: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "teamMembers",
        foreignField: "_id",
        as: "teamMembers",
        pipeline: [
          {
            $project: {
              fullName: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);
  console.log(projects);
  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Found all projects"));
});

export { uploadProject, deleteProject, updateProject, getProject, getAll };
