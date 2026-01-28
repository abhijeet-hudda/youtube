import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/APIErrors.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    // console.log(videoId)
    // console.log(limit)

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "video not found")
    }
    const commentAggregate = Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            avatar:1,
                            username:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const comments = await Comment.aggregatePaginate(commentAggregate, options);
     return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "video comments fetched successfully")
    );


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
    // console.log(videoId);
    // console.log(content)

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    if(!content|| !content.trim() ){
        throw new ApiError(400,"Comment content is required")
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "video not found");
    }

    const comment = await Comment.create({
      content: content,
      owner: req.user?._id,
      video: videoId,
    });

    const populatedComment = await comment.populate("owner", "username avatar");

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        populatedComment, 
        "Comment added successfully"
    ));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { newContent } = req.body;
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!newContent || !newContent.trim()) {
        throw new ApiError(400, "Content cannot be empty");
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
        _id: commentId,
        owner: req.user._id,
        },
        {
        content: newContent.trim(),
        },
        {
        new: true,           
        runValidators: true,
        }
    );

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invalid comment Id")
    }

    const comment= await Comment.findById(commentId)
    
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if(comment.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to delete this comment")
    }

    await Like.deleteMany({
        comment:commentId,
    })
    
    await comment.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "deleted the comment successfully"
    ));
})

const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: get video by id
  /* steps 
    1. validate videoId
    2. use findById to get video from db
    */
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  // const video = await Video.findById(videoId).populate("owner", "username avatar");
  // if (!video) {
  //   throw new ApiError(404, "Video not found");
  // }
  const comment= await Comment.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(commentId) }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes"
      }
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" }
      }
    },
    {
      $project: {
        likeCount: 1,
        createdAt:1,
        updatedAt:1,
      }
    }
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200,comment, "comment fetched successfully"));
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment,
    getCommentById 
}