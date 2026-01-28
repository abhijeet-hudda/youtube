import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addComment, deleteComment, getCommentById, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { toggleCommentLike } from "../controllers/like.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/add-comment/:videoId").post(addComment)
router.route("/video-comments/:videoId").get(getVideoComments)
router.route("/update-comment/:commentId").patch(updateComment)
router.route("/:commentId").delete(deleteComment)
router.route("/comment-detail/:commentId").get(getCommentById)
router.route("/commentLike-toggle/:commentId").post(toggleCommentLike)



export default router