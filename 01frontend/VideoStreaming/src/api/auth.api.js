import api from "./axios.instance"


async function createAccount(formData){
    console.log("this is formData",formData);
    const response = await api.post("/users/register",formData
    )
    console.log(response)
    return response.data
}
async function login(formData){
    const response = await api.post("/users/login",formData
    );
    //console.log(response)
    return response.data
}
async function logout(){
    const response = await api.post("/users/logout");
    //console.log(response)
    return response?.data
}
async function getCurrentUser(){
    const response = await api.get("/users/current-user");
    //console.log(resopnse);
    return response.data
}
async function changePassword(data) {
    const response = await api.post("/users/change-password",data);
    //console.log(response);
    return response.data
}
async function updateAccountDetails() {
    const response = await api.patch("/users/update-account",data);
    //console.log(response);
    return response.data;
}
async function updateAvatar(avatarFile){
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    
    const response = await api.patch("/users/avatar",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    )

    return response.data;

}
async function updateCoverImage(coverImageFile){
    const formData = new FormData();
    formData.append("coverImage", coverImageFile);
    
    const response = await api.patch("/users/cover-image",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    )

    return response.data;

}
async function getUserChannelProfile(username){
    const response = await api.get(`/users/channel/${username}`)
    //console.log(response)
    return response.data
}
async function refreshAccessToken(){
  const response = await api.post("/refresh-token");
  return response.data;
};
export default {
    createAccount,
    login,
    logout,
    getCurrentUser,
    changePassword,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    refreshAccessToken

}
