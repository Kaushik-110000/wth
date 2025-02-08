import { Router } from "express";
import {
  createCollaboration,
  getCollaboration,
  getAllCollaborations,
  updateCollaboration,
  deleteCollaboration,
} from "../controllers/collaboration.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

// Routes for Collaboration CRUD operations
router.post("/", verifyJWT, createCollaboration);
router.get("/collaboration/:collaborationId", getCollaboration);
router.get("/:userName", getAllCollaborations);
router.patch("/:collaborationId", verifyJWT, updateCollaboration);
router.delete("/:collaborationId", verifyJWT, deleteCollaboration);

export default router;
 