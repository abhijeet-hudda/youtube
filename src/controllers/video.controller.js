import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/APIErrors.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    /* steps
    1. match stage based on query and userId
    2. sort stage based on sortBy and sortType
    3. paginate using mongoose-aggregate-paginate-v2
    4. return paginated result
    */

    const match = {}
    if(query){
        match.$or = [
            {title:{$regex: query, $options: 'i'}},
            {description:{$regex: query, $options: 'i'}}
        ]
    }
    if(userId){
        if(!isValidObjectId(userId)){
            throw new ApiError(400,"Invalid userId")
        }
        match.owner = new mongoose.Types.ObjectId(userId);
    }
    //yha tak constructed match ovject for match stage
    const sort = {}
    if(sortBy){
        sort[sortBy] = sortType === 'desc' ? -1 : 1
    }
    else{
        sort.createdAt = -1 //default sort by createdAt desc
    }
    //yha tak constructed sort object for sort stage

    const aggregate = Video.aggregate([
        {
            $match: match
        },
        {
            $sort: sort
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
        {   //addFields use kiya bcz owner :[{}] ye na mil ke {} direct object mile 
            $addFields:{
                owner:{
                    $first: "$owner"
                }
            }
        }
    ])

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10

    const options={
        page: pageNum,
        limit: limitNum
    }

    const videos = await Video.aggregatePaginate(aggregate, options)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        videos,
        "videos fetched successfully"
    ))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    /* steps
    1. get videofile and thumbnail from req.files
    2. upload both to cloudinary using uploadOnCloudinary function
    3. validate if both uploaded successfully
    4. validate title and description
    5. create video in db
    6. return success response
    */
    const videoLocalPath = req.files?.videofile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath||!thumbnailLocalPath){
        throw new ApiError(400,"videoFile and thumbnail both are required")
    }
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video || !thumbnail){
        throw new ApiError(500,"Error uploading to cloudinary")
    }

    if(!title){
        throw new ApiError(400,"title is required")
    }
    if(!description) throw new ApiError(400,"description is required")
    
    const createdVideo = await Video.create({
        videofile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        title,
        description,
        owner: req.user?._id
    })
    if(!createdVideo){
        throw new ApiError(500,"Error to save video in db")
    }
    return res
    .status(201)
    .json(new ApiResponse(
        201,
        createdVideo,
        "video published successfully"
    ))


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    /* steps 
    1. validate videoId
    2. use findById to get video from db
    */
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "video fetched successfully"
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description} = req.body

    

    // const video = await Video.findById(videoId)
    // if(!video){
    //     throw new ApiError(404, "Video not found")
    // }
    // if(video.owner.toString() !== req.user._id.toString()){
    //     throw new ApiError(403, "You are not authorized to update this video")
    // }
    // //update video details
    // if(title) video.title = title
    // if(description) video.description = description
    // //uplodad new thumbnail to cloudinary if provided
    // const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    // if(!thumbnailLocalPath){
    //     throw new ApiError(400, "Thumbnail file is required")
    // }
    // const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    // if(!thumbnail){
    //     throw new ApiError(500, "Error uploading thumbnail to cloudinary")
    // }
    // video.thumbnail = thumbnail.url
    

    // const updatedVideo = await video.save({validateBeforeSave: false})

    // return res
    // .status(200)
    // .json(new ApiResponse(
    //     200,
    //     updatedVideo,
    //     "Video updated successfully"
    // ))

    const newThumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!title && !description && !newThumbnailLocalPath){
        throw new ApiError(400,"Atleast one filed (title,description,newThumbnail) is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    let newThumbnailUrl = video.thumbnail.url;
    if(newThumbnailLocalPath){
        const newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
        if(!newThumbnail){
            throw new ApiError(500,"Error uploading new thumbnail to cloudinary")
        }
        newThumbnailUrl = newThumbnail.url;
    }
    //console.log(newThumbnailUrl);
    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                title: title || video.title,
                description: description || video.description,
                thumbnail: newThumbnailUrl || video.thumbnail,
            }
        },
        {
            new: true
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedVideo,
        "Video updated successfully"
    ))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invaild videoId")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    // const isPublished = video.isPublished
    // const updatedvideo = await Video.findByIdAndUpdate(videoId,
    //     {
    //         isPublished: !isPublished
    //     },
    //     {
    //         new: true
    //     }
    // )

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "PublishStatus toggled successefully"
    ))
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    togglePublishStatus
}