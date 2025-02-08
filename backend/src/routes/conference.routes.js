import { Router } from "express";
import {
  createConference,
  getConferencesByUser,
  getOneConference,
  updateConference,
  deleteConference,
} from "../controllers/conference.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createConference);
router.get("/:userName", getConferencesByUser);
router.get("/conference/:conferenceId", getOneConference);
router.patch("/:conferenceId", verifyJWT, updateConference);
router.delete("/:conferenceId", verifyJWT, deleteConference);

export default router;
