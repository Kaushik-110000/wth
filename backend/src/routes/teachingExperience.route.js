import { Router } from "express";
import {
  createTeachingExperience,
  getTeachingExperienceByUser,
  getOneTeachingExperience,
  updateTeachingExperience,
  deleteTeachingExperience,
} from "../controllers/teachingExperience.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", upload.single("syllabusFile"), verifyJWT, createTeachingExperience);
router.get("/:userName", getTeachingExperienceByUser);
router.get("/experience/:experienceId", getOneTeachingExperience);
router.patch("/:experienceId", upload.single("syllabusFile"), verifyJWT, updateTeachingExperience);
router.delete("/:experienceId", verifyJWT, deleteTeachingExperience);

export default router;
