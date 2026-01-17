import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/APIErrors.js"
import { ApiResponse } from "../utils/APIResponse.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"Channel not found")
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel:channelId
    })

    if(isSubscribed){
        await isSubscribed.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "subscription removed for this channel"
        ))
    }
    
    const newSubscriber = await Subscription.create({
        subscriber: req.user?._id,
        channel:channelId
    })
    
    const populatednewSubsriber = await newSubscriber.populate("subscriber","username avatar")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        populatednewSubsriber,
        "New subscription add successfully"
    ))


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }

    // const channel = await User.findById(channelId)
    // if(!channel){
    //     throw new ApiError(404,"Channel not found")
    // }
    // return res
    // .status(200)
    // .json(new ApiResponse(
    //     200,
    //     channel.channelSubscriberCount,
    //     "subcriber count fetched"
    // ))
    // const subscribers = await Subscription.findById(channelId).populate("subscriber", "username avatar")

    // const subscribers = await Subscription.find({channel: channelId})
    // .populate("subscriber", "username avatar")
      
    const subscribers = await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                subscriber:{
                    $first:"$subscriber"
                }
            }
        }
    ])
    

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        subscribers,
        "subscribers list for channel fetched successfully"
    ))

})

// // controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
      throw new ApiError(400, "Invalid subscriberId")
    }

//   const subscribedChannels = await Subscription.find({
//     subscriber: subscriberId
//   })
//     .populate("channel", "username avatar")
//     .select("-subscriber") // optional: hide subscriber field
    

    const subscribedChannels = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedChannel",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                subscribedChannel:{
                    $first:"$subscribedChannel"
                }
            }
        },
        {
            $replaceRoot:{
                newRoot:"$subscribedChannel"
            }
        }
    ])
   

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully"
    ))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}