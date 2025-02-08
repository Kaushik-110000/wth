import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Collaboration } from "../models/collaboration.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createCollaboration = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "You are unauthenticated");
  }

  const { partnerName, description, startDate, endDate, relatedProjects } =
    req.body;

  if (!partnerName || !description || !startDate || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  let projectIds = [];
  if (relatedProjects && Array.isArray(relatedProjects)) {
    try {
      projectIds = relatedProjects.map((id) => new mongoose.Types.ObjectId(id));
    } catch (error) {
      throw new ApiError(400, "Invalid project ID format in relatedProjects");
    }
  }

  const collaboration = await Collaboration.create({
    partnerName,
    description,
    startDate,
    endDate,
    relatedProjects: projectIds,
    recepient: new mongoose.Types.ObjectId(userId),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, collaboration, "Collaboration created successfully")
    );
});

const getCollaboration = asyncHandler(async (req, res) => {
  const { collaborationId } = req.params;
  if (!collaborationId) {
    throw new ApiError(400, "Collaboration ID is required");
  }

  const collaboration =
    await Collaboration.findById(collaborationId).populate("relatedProjects");

  if (!collaboration) {
    throw new ApiError(404, "Collaboration not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collaboration,
        "Collaboration retrieved successfully"
      )
    );
});

const getAllCollaborations = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(404, "Username not present");
  }
  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const userId = user?._id;
  const collaborations = await Collaboration.aggregate([
    {
      $match: {
        recepient: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "relatedProjects",
        foreignField: "_id",
        as: "relatedProjects",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collaborations,
        "Collaborations retrieved successfully"
      )
    );
});

const updateCollaboration = asyncHandler(async (req, res) => {
  const { collaborationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(collaborationId)) {
    throw new ApiError(400, "Invalid Collaboration ID");
  }

  // Ensure relatedProjects are valid ObjectIds
  const { partnerName, description, startDate, endDate, relatedProjects } =
    req.body;
  let projectIds = [];

  if (relatedProjects && Array.isArray(relatedProjects)) {
    projectIds = relatedProjects
      .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Filter out invalid IDs
      .map((id) => new mongoose.Types.ObjectId(id));
  }

  const updatedCollaboration = await Collaboration.findByIdAndUpdate(
    collaborationId,
    {
      $set: {
        partnerName,
        description,
        startDate,
        endDate,
        relatedProjects: projectIds, // Ensure valid IDs are saved
      },
    },
    { new: true } // Returns updated document
  );

  if (!updatedCollaboration) {
    throw new ApiError(404, "Collaboration not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCollaboration,
        "Collaboration updated successfully"
      )
    );
});

const deleteCollaboration = asyncHandler(async (req, res) => {
  const { collaborationId } = req.params;
  if (!collaborationId) {
    throw new ApiError(400, "Collaboration ID is required");
  }

  const collaboration = await Collaboration.findById(collaborationId);
  if (!collaboration) {
    throw new ApiError(404, "Collaboration not found");
  }

  await Collaboration.findByIdAndDelete(collaborationId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collaboration deleted successfully"));
});

export {
  createCollaboration,
  getCollaboration,
  getAllCollaborations,
  updateCollaboration,
  deleteCollaboration,
};
