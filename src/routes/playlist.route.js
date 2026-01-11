import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { 
    addVideoToPlaylist,
    createPlaylist,
    getPlaylistById,
    getUserPlaylists, 
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist);
router.route("/getuser-playlists/:userId").get(getUserPlaylists);
router.route("/get-playlistbyId/:playlistId").get(getPlaylistById)
router.route("/:playlistId/videos/:videoId").patch(addVideoToPlaylist)
router.route("/:playlistId").patch(updatePlaylist)


export default router