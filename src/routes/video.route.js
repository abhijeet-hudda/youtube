import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    getAllVideos,
    publishAVideo,
   } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllVideos)
router.route("/publish").post(
    upload.fields([
        {
            name: "videofile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo)
    

export default router

