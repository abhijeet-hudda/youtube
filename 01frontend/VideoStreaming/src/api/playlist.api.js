import api from "./axios.instance";

async function createPlaylist(formData) {
    const response = await api.post("/playlists/create-playlist",formData)
    return response.data;
}
async function getUserPlaylists(userId){
    //console.log("api userId",userId)
    const response = await api.get(`/playlists/getuser-playlists/${userId}`)
    //console.log("api response",response.data);
    return response.data;
}
async function getPlaylistById(playlistId){
    const response = await api.get(`/playlists/get-playlistbyId/${playlistId}`)
    return response.data;
}
async function addVideoPlaylist({videoId,playlistId}){
    //console.log("playlistId",playlistId);
    //console.log("videoId",videoId);
    const response = await api.patch(`/playlists/${playlistId}/videos/${videoId}`)
    //console.log("res data",response.data)
    return response.data;
}
async function updatePlaylist(playlistId,{name,description}) {
    const response = await api.patch(`/playlists/${playlistId}`,{
        name,
        description
    })
    return response.data;
}

export default {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoPlaylist,
    updatePlaylist
}
