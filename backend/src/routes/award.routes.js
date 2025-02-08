import { Router } from "express";
import {
  createAward,
  getPersonAward,
  updateAward,
  deleteAward,
  getOneaward,
} from "../controllers/award.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/", upload.single("certificate"), verifyJWT, createAward);
router.get("/:userName", getPersonAward);
router.get("/award/:awardId", getOneaward);
router.patch("/:awardId", upload.single("certificate"), verifyJWT, updateAward);
router.delete("/:awardId", verifyJWT, deleteAward);

export default router;
