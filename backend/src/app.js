import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import awardsRouter from "./routes/award.routes.js";
import collaborationRouter from "./routes/collaboration.routes.js";
import achievementRouter from "./routes/achievement.routes.js";
import conferenceRouter from "./routes/conference.routes.js";
import postRouter from "./routes/post.routes.js";
import researchPaperRouter from "./routes/researchPaper.routes.js";
import teachingExperienceRouter from "./routes/teachingExperience.route.js";
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/awards", awardsRouter);
app.use("/api/v1/collaborations", collaborationRouter);
app.use("/api/v1/achievements", achievementRouter);
app.use("/api/v1/conferences", conferenceRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/researchpapers", researchPaperRouter);
app.use("/api/v1/teachingexperience", teachingExperienceRouter);
export { app };
