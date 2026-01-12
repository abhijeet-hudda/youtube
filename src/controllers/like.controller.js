import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError, APIError} from "../utils/APIErrors.js"
import {APIResonse, ApiResponse} from "../utils/APIResponse.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    //method =>find by video and likedby(user)
    const isLike = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "video not found")
    }
    if(isLike){
        await isLike.deleteOne();
        video.likes = Math.max(0, video.likes - 1);
        await video.save();
        //method-2
    //     await Promise.all([
    //   Like.deleteOne({ _id: like._id }),
    //   Video.updateOne(
    //     { _id: videoId },
    //     { $inc: { likes: -1 } }
    //   ),
    // ]);
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Like removed from this video"
        ))
    }
    const createLike = await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })
    video.likes += 1;
    await video.save()
    const updatedLike = await createLike.populate("likedBy","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {updatedLike},
        "successfully like the video "
    ))

})

// const toggleVideoLike = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   const userId = req.user?._id;

//   // 1️⃣ Auth check
//   if (!userId) {
//     throw new ApiError(401, "Unauthorized");
//   }

//   // 2️⃣ Validate videoId
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   // 3️⃣ Ensure video exists (fail fast)
//   const videoExists = await Video.exists({ _id: videoId });
//   if (!videoExists) {
//     throw new ApiError(404, "Video not found");
//   }

//   // 4️⃣ Check if user already liked the video
//   const existingLike = await Like.findOne({
//     video: videoId,
//     likedBy: userId,
//   }).select("_id");

//   // 5️⃣ UNLIKE
//   if (existingLike) {
//     await Like.deleteOne({ _id: existingLike._id });

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         { isLiked: false },
//         "Like removed from video"
//       )
//     );
// }
// })

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid video id")
    }
    //method =>find by video and likedby(user)
    const isLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });
    const comment = await Comment.findById(videoId);
    if(!comment){
        throw new ApiError(404, "video not found")
    }
    if(isLike){
        await isLike.deleteOne();
        comment.likes = Math.max(0, video.likes - 1);
        await comment.save();
        //method-2
    //     await Promise.all([
    //   Like.deleteOne({ _id: like._id }),
    //   Video.updateOne(
    //     { _id: videoId },
    //     { $inc: { likes: -1 } }
    //   ),
    // ]);
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Like removed from this video"
        ))
    }
    const createLike = await Like.create({
        comment:commentId,
        likedBy:req.user?._id
    })
    comment.likes += 1;
    await comment.save()
    const updatedLike = await createLike.populate("likedBy","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {updatedLike},
        "successfully like the video "
    ))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid video id")
    }
    //method =>find by video and likedby(user)
    const isLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "video not found")
    }
    if(isLike){
        await isLike.deleteOne();
        tweet.likes = Math.max(0, tweet.likes - 1);
        await tweet.save();
        //method-2
    //     await Promise.all([
    //   Like.deleteOne({ _id: like._id }),
    //   Video.updateOne(
    //     { _id: videoId },
    //     { $inc: { likes: -1 } }
    //   ),
    // ]);
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Like removed from this video"
        ))
    }
    const createLike = await Like.create({
        tweet:tweetId,
        likedBy:req.user?._id
    })
    tweet.likes += 1;
    awaittweeto.save()
    const updatedLike = await createLike.populate("likedBy","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {updatedLike},
        "successfully like the video "
    ))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
   
  //fetch all the liked videos from the Likes model- search for docs in likes model that have video(any) and likedBy(requesting user) 

  const likedVideoDocs=await Like.find({
    likedBy:req.user._id,
    video:{$exists:true}
  }).populate("video")

  const likedVideos=likedVideoDocs.map(likeDoc=>likeDoc.video)

  return res
  .status(200)
  .json(new ApiResponse(200, likedVideos, "successfully fetched all liked Videos"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };