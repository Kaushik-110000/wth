import { Router } from "express";
import {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Middleware to get req.user

const router = Router();

// Routes for Post CRUD operations
router.post("/", verifyJWT, createPost); // Only authenticated users can create posts
router.get("/:userName", getAllPosts); // Get all posts (or filter by userName via query)
router.get("/post/:postId", getPost);
router.patch("/:postId", verifyJWT, updatePost); // Only the post owner can update
router.delete("/:postId", verifyJWT, deletePost); // Only the post owner can delete

export default router;
