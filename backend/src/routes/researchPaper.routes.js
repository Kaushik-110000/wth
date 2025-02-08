import { Router } from "express";
import {
  createResearchPaper,
  getResearchPaperById,
  getResearchPapersByUserName,
  updateResearchPaper,
  deleteResearchPaper,
} from "../controllers/researchPaper.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", upload.single("pdfFile"), verifyJWT, createResearchPaper);
router.get("/:userName", getResearchPapersByUserName);
router.get("/paper/:researchPaperId", getResearchPaperById);
router.patch("/:researchPaperId", upload.single("pdfFile"), verifyJWT, updateResearchPaper);
router.delete("/:researchPaperId", verifyJWT, deleteResearchPaper);

export default router;
