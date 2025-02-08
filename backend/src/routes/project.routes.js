import { Router } from "express";
import {
  uploadProject,
  deleteProject,
  getProject,
  updateProject,
  getAll,
} from "../controllers/project.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/").post(upload.array("images", 10), verifyJWT, uploadProject);
router.route("/:projectId").delete(verifyJWT, deleteProject);
router.route("/project/:projectId").get(getProject);
router
  .route("/:projectId")
  .patch(upload.array("images", 10), verifyJWT, updateProject);
router.route("/:userName").get(getAll);
export default router;
