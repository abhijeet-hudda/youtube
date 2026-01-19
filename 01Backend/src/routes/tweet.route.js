import { Router } from "express"
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTweet,
    getUserTweets,
    updateTweet
 } from "../controllers/tweet.controller.js";

const router = Router()

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-tweet").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/updateTweet/:tweetId").patch(updateTweet)

export default router

