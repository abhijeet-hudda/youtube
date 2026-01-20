import api from "./axios.instance";

async function createPlaylist({name,description}) {
    const response = await api.post("/playlists/create-playlist",{
        name,
        description
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
    addVideoToPlaylist,
    updatePlaylist
}
