import { Router } from "express";
import { logoutUser,loginUser,userRegister,refreshAccesssToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    userRegister
);

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(verifyJWT,logoutUser)
router.route("refresh-token").post(refreshAccesssToken)


export default router