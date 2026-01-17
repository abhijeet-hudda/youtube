import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/APIErrors.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

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

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}