import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const project = await Project.create({
    title,
    description,
    startDate: startDate || null,
    endDate: endDate || null,
    technologiesUsed: technologiesUsed || null,
    teamMembers: teamMembers || null,
    githubLink: githubLink || null,
    mediaUrls: mediaUrls || null,
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
  return res.status(200).json(new ApiResponse(200, {}, "Project found"));
});

export { uploadProject, deleteProject, updateProject, getProject };
