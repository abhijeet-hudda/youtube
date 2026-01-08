import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getAllVideos } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllVideos)


export default router

