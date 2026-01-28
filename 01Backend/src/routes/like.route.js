import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router= Router()
router.use(verifyJWT) 

// put these routes in there specific videoroutes, tweetroutes, etc files
router.route("/toggle-tweetlike/:tweetId").post(toggleTweetLike)


router.route("/likedVideos").get(getLikedVideos)

export default router;