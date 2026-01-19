import api from "./axios.instance";

async function addComment(videoId, content){
    const response = await api.post(`/comments/add-comment/${videoId}`,{
        content,
    });
    return response.data;
}
async function getVideoComments(videoId,{page=1,limit=10}){
    const response = await api.get(`/comments/video-comments/${videoId}`,{
        params:{
            page,
            limit
        }
    });

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

export default {
    addComment,
    updateComment,
    getVideoComments,
    deleteComment
}