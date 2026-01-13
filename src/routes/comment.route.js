import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/add-comment/:videoId").post(addComment)
router.route("/video-comments/:videoId").get(getVideoComments)
router.route("/update-comment/:commentId").patch(updateComment)
router.route("/:commentId").delete(deleteComment)



export default router