import { Router } from "express";
import {
  uploadProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/").post(upload.array("images", 10), uploadProject);
router.route("/:projectId").delete(verifyJWT, deleteProject);
export default router;
