import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router= Router()
router.use(verifyJWT) 

// put these routes in there specific videoroutes, tweetroutes, etc files 

router.route("/:videoId/like").post(toggleVideoLike)
router.route("/:commentId/like").post(toggleCommentLike)
router.route("/:tweetId/like").post(toggleTweetLike)

router.route("/likedVideos").get(getLikedVideos)

export default router;