import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlists.model.js"
import {Video} from "../models/video.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/APIErrors.js"
import { ApiResponse } from "../utils/APIResponse.js"
import {User} from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if (!name || !name.trim()) {
        throw new ApiError(400, "playlist name cannot be empty");
    }

    if (!description || !description.trim()) {
        throw new ApiError(400, "playlist description cannot be empty");
    }

    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user._id,
    })
    if (!playlist) {
        throw new ApiError(500, "failed to create playlist");
    }

    const populatedPlaylist = await playlist.populate("owner", "username avatar");
    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        populatedPlaylist,
        "Playlist created successfully"
    ))




})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user ID")
    }
    const user = await User.findById(userId).select("username avatar")
    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const playlists = await Playlist.find({
        owner: userId,
    }).sort({ createdAt: -1 });

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, playlists },
        "user's playlists fetched successfully"
      )
    );

})
//use aggregation pipeline to get playlist
// const getUserPlaylists = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   if (!isValidObjectId(userId)) {
//     throw new ApiError(400, "Invalid user ID");
//   }

//   const users = await User.aggregate([
//     // 1️ Match the user
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(userId),
//       },
//     },

//     // 2️ Join playlists
//     {
//       $lookup: {
//         from: "playlists",
//         let: { userId: "$_id" },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ["$owner", "$$userId"] },
//             },
//           },
//           { $sort: { createdAt: -1 } },
//         ],
//         as: "playlists",
//       },
//     },

//     // 3️Final shape
//     {
//       $project: {
//         username: 1,
//         avatar: 1,
//         playlists: 1,
//       },
//     },
//   ]);

//   if (!users.length) {
//     throw new ApiError(404, "User not found");
//   }

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       users[0],   
//       "User playlists fetched successfully"
//     )
//   );
// });


const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  const populatedPlaylist = await playlist.populate([
    {
      path: "owner",
      select: "username avatar", //gives owner's playlist details
    },
    {
      path: "video", //populate the video array in the playlist
      select: "title description duration views likes", // gives video details
      populate: {
        //nested populate
        path: "owner",
        select: "username avatar", // gives the owner details for each video
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedPlaylist, "playlist fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id,
    });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    //for better performance, we use .exists instead of .findById
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //we can  use .push but it allows duplicates
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
        $addToSet: { video: videoId }, // prevents duplicates
        },
        { new: true }
    );
    //we use findOneAndUpdate for one query instead of two query(.findOne,.findAndUpdate)

    return res
    .status(200)
    .json(
    new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
    )
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id,
    });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    //for better performance, we use .exists instead of .findById
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { video: videoId }, // removes the video from the playlist
        },
        { new: true }
    );
    //we use findOneAndUpdate for one query instead of two query(.findOne,.findAndUpdate)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video removed from playlist successfully"
        )
    );
});

// const deletePlaylist = asyncHandler(async (req, res) => {
//     const {playlistId} = req.params
//     // TODO: delete playlist
// })

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id,
    });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name: name||playlist.name,
            description: description||playlist.description
        },
        { new: true }
    );
    //In one query
//     const updatedPlaylist = await Playlist.findOneAndUpdate(
//     {
//       _id: playlistId,
//       owner: req.user._id,   //  authorization
//     },
//     {
//       ...(name !== undefined && { name }),
//       ...(description !== undefined && { description }),
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!updatedPlaylist) {
//     throw new ApiError(404, "Playlist not found or unauthorized");
//   }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedPlaylist,
        "Playlist updated successfylly"
    ))

})

export {

    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist

}