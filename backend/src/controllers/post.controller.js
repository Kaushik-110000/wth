import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const createPost = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, content, tags } = req.body;
  const userId = req.user?._id; // Extract user ID from JWT token

  if (!userId) {
    throw new ApiError(404, "You are not authenticated");
  }

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const post = await Post.create({
    title,
    content,
    author: userId,
    tags: tags || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId).populate("author", "userName email");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  let posts;
  if (userName) {
    const user = await User.findOne({ userName: userName.trim() });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    posts = await Post.find({ author: user._id }).populate(
      "author",
      "userName email"
    );
  } else {
    posts = await Post.find().populate("author", "username email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  console.log(post.author.toString(), userId.toString());
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  const { title, content, tags } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { title, content, tags },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Ensure the user is the author of the post
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getPost, getAllPosts, updatePost, deletePost };
