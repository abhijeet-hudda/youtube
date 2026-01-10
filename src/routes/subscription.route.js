import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();
router.use(verifyJWT);

router.route("/:channelId/toggle-subscription").patch(toggleSubscription)

router.route("/:channelId/subscribers").get(getUserChannelSubscribers)
router.route("/:subscriberId/subscribedChannels").get(getSubscribedChannels)

export default router