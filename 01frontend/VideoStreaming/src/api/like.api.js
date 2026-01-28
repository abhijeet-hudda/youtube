import api from "./axios.instance";

async function toggleVideoLike(videoId){
    const response = await api.post(`/videos/toggle-videolike/${videoId}/like`);
    //console.log("video like response", response)
    return response.data;
}
async function toggleTweetLike(tweetId){
    const response = await api.post(`/likes/toggle-tweetlike/${tweetId}/like`);
    return response.data;
}
async function toggleCommentLike(commentId){
    const response = await api.post(`/comments/commentLike-toggle/${commentId}`);
    console.log("commentlike", response.data)
    return response.data;
    
}
async function getLikedVideos(){
    const response = await api.get("/likes/likedVideos");
    return response.data
}

export default {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}