import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ReasearchPaper } from "../models/researchPaper.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createResearchPaper = asyncHandler(async (req, res) => {
  const { title, abstract, publicationDate, journal, tags } = req.body;

  if (!title || !abstract || !publicationDate) {
    throw new ApiError(400, "Title, abstract, and publication date are required");
  }

  const userId = req?.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  let pdfUrl = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    pdfUrl = uploadResult.url;
  }

  const researchPaper = await ReasearchPaper.create({
    title,
    abstract,
    publicationDate,
    authors: [userId],
    journal: journal || null,
    pdfFile: pdfUrl,
    tags: tags || [],
  });

  return res.status(201).json(new ApiResponse(201, researchPaper, "Research Paper added successfully"));
});

const getResearchPaperById = asyncHandler(async (req, res) => {
  const { researchPaperId } = req.params;

  const researchPaper = await ReasearchPaper.findById(researchPaperId).populate(
    "authors",
    "userName email fullName"
  );

  if (!researchPaper) {
    throw new ApiError(404, "Research Paper not found");
  }

  return res.status(200).json(new ApiResponse(200, researchPaper, "Research Paper retrieved successfully"));
});

const getResearchPapersByUserName = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiError(400, "User name is required");
  }

  const user = await User.findOne({ userName: userName.trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;
  const researchPapers = await ReasearchPaper.aggregate([
    {
      $match: {
        authors: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!researchPapers.length) {
    throw new ApiError(404, "No research papers found");
  }

  return res.status(200).json(new ApiResponse(200, researchPapers, "Research Papers retrieved successfully"));
});

const updateResearchPaper = asyncHandler(async (req, res) => {
  const { researchPaperId } = req.params;
  const { title, abstract, publicationDate, journal, tags } = req.body;

  const researchPaper = await ReasearchPaper.findById(researchPaperId);
  if (!researchPaper) {
    throw new ApiError(404, "Research Paper not found");
  }

  if (!researchPaper.authors.includes(req.user.id)) {
    throw new ApiError(403, "You are not authorized to update this research paper");
  }

  let pdfUrl = researchPaper.pdfFile;
  if (req.file) {
    if (pdfUrl) {
      await deleteFromCloudinary(pdfUrl);
    }
    const uploadResult = await uploadOnCloudinary(req.file.path);
    pdfUrl = uploadResult.url;
  }

  researchPaper.title = title || researchPaper.title;
  researchPaper.abstract = abstract || researchPaper.abstract;
  researchPaper.publicationDate = publicationDate || researchPaper.publicationDate;
  researchPaper.journal = journal || researchPaper.journal;
  researchPaper.pdfFile = pdfUrl;
  researchPaper.tags = tags || researchPaper.tags;

  await researchPaper.save();

  return res.status(200).json(new ApiResponse(200, researchPaper, "Research Paper updated successfully"));
});

const deleteResearchPaper = asyncHandler(async (req, res) => {
  const { researchPaperId } = req.params;
  const researchPaper = await ReasearchPaper.findById(researchPaperId);

  if (!researchPaper) {
    throw new ApiError(404, "Research Paper not found");
  }

  if (!researchPaper.authors.includes(req.user.id)) {
    throw new ApiError(403, "You are not authorized to delete this research paper");
  }

  if (researchPaper.pdfFile) {
    await deleteFromCloudinary(researchPaper.pdfFile);
  }

  await ReasearchPaper.findByIdAndDelete(researchPaperId);

  return res.status(200).json(new ApiResponse(200, {}, "Research Paper deleted successfully"));
});

export {
  createResearchPaper,
  getResearchPaperById,
  getResearchPapersByUserName,
  updateResearchPaper,
  deleteResearchPaper,
};
