import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/APIErrors.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    /* steps
    1.validate req.body content
    2.find user by req.userId
    3.create tweet with owner as user._id and content from req.body
    4.save tweet
    5.return success response with created tweet

    */
   const {content} = req.body;
   if(!content?.trim()  || content.length > 280){
    throw new ApiError(400, "Content is required and must be less than 280 characters");
   }

   const userId = req.user?._id
   if(!userId){
    throw new ApiError(401, "Unauthorized user");
   }
   const tweet = await Tweet.create({
    owner: userId,
    content:content
   })
   if(!tweet){
    throw new ApiError(500, "Failed to create tweet");
   }
   const populatedTweet = await tweet.populate("owner", "username name avatar");

   return res
   .status(201)
   .json(new ApiResponse(
    201,
    populatedTweet,
    "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    /*
    1. validate userId from req.params
    2. find tweets by owner userId, sort by createdAt desc
    */
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"userId is required")
    }
    /*
    // match userid with user(findbyid)
    const tweets = await Tweet.find({owner: userId})
    .sort({createdAt: -1})
    .populate("owner", "username name avatar")
    */
   const user = await User.findById(userId)

   if (!user){
    throw new ApiError(404, "User not found");
   }
   
   const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort:{
                createdAt: -1
            }
        },
        {
            $lookup:{
                from: "users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
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
                owner:{
                    $first: "$owner"
                }
            }
        }

   ])

   return res
   .status(200)
   .json(new ApiResponse(
    200,
    tweets,
    "User tweets fetched successfully"
   ))
   
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetId} = req.params

    if(!content?.trim()  || content.length > 280){
        throw new ApiError(400, "Content is required and must be less than 280 characters");
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        { 
            new: true
        }
    );
    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        ));
})

// const deleteTweet = asyncHandler(async (req, res) => {
//     //TODO: delete tweet
// })

export {
    createTweet,
    getUserTweets,
    updateTweet
}