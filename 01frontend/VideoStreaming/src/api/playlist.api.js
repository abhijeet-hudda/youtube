import api from "./axios.instance";

async function createPlaylist({name,descripation}) {
    const response = await api.post("/playlists/create-playlist",{
        name,
        descripation
    })
    return response.data;
}
async function getUserPlaylists(userId){
    const response = await api.get(`/plalists/getuser-playlists/${userId}`)
    return response.data;
}
async function getPlaylistById(playlistId){
    const response = await api.get(`/playlists/get-playlistbyId/${playlistId}`)
    return response.data;
}
async function addVideoToPlaylist(videoId,playlistId){
    const response = await api.patch(`/playlists/${playlistId}/videos/${videoId}`)
    return response.data;
}
async function updatedPlaylist(playlistId,{name,descripation}) {
    const response = await api.patch(`/playlists/${playlistId}`,{
        name,
        descripation
    })
    return response.data;
}

export default {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    updatedPlaylist
}
