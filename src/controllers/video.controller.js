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
                as:"ownerDetails",
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
                    $first: "$ownerDetails"
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


export {
    getAllVideos
}