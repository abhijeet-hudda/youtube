import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    updateVideo,
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

router.route("/:videoId").get(getVideoById);
router.route("/updateVideo/:videoId").patch(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    updateVideo
)
router.route("/delete-video/:videoId").delete(deleteVideo);


export default router

