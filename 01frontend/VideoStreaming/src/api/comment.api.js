import api from "./axios.instance";

async function addComment(videoId, content){
    // console.log("videoId",videoId);
    // console.log("content",content);
    const response = await api.post(`/comments/add-comment/${videoId}`,{content});
    //console.log("response",response)
    return response.data;
}
async function getVideoComments({videoId},{page=1,limit=10}){
    //console.log("comment videoId",videoId)
    // console.log("limit",limit)
    const response = await api.get(`/comments/video-comments/${videoId}`,{
        params:{
            page,
            limit
        }
    });
    //console.log("commets res", response)

    return response.data;
}
async function updateComment(commentId,newContent){
    const response = await api.patch(`/comments/update-comment/${commentId}`,{
        newContent
    })
    return response.data
}
async function deleteComment(commentId){
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
}
async function getCommentById(commentId){
    const response = await api.get(`/comments/comment-detail/${commentId}`);
    return response.data;
}

export default {
    addComment,
    updateComment,
    getVideoComments,
    deleteComment,
    getCommentById
}