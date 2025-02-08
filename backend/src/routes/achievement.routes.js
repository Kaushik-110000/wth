import { Router } from "express";
import {
  createAchievement,
  getPersonAchievements,
  updateAchievement,
  deleteAchievement,
  getOneAchievement,
} from "../controllers/achievement.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", upload.single("certificate"), verifyJWT, createAchievement);
router.get("/:userName", getPersonAchievements);
router.get("/achievement/:achievementId", getOneAchievement);
router.patch("/:achievementId", upload.single("certificate"), verifyJWT, updateAchievement);
router.delete("/:achievementId", verifyJWT, deleteAchievement);

export default router;
