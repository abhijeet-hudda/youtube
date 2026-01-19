import api from "./axios.instance";

async function getUserTweets(userId){
    const response = await api.get(`/tweets/user/${userId}`)
    return response.data
}
async function createTweet(content){
    const response = await api.post("/tweets/create-tweet",{content})
    return response.data;   
}
async function updateTweet(tweetId, content){
    const response = await api.patch(`/tweets/updateTweet/${tweetId}`,{content})
    return response.data
}

export default {
    getUserTweets,
    createTweet,
    updateTweet
}