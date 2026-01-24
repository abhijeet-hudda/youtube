import api from "./axios.instance"


async function toggleSubscription(channelId){
    const response = await api.patch(`/subscriptions/${channelId}/toggle-subscription`)
    //console.log("subscrition response", response.data)
    return response.data;
}
async function getUserChannelSubscribers(channelId){
    const response = await api.get(`/subscriptions/${channelId}/subscribers`)
    return response.data
}
async function getSubscribedChannels(subscriberId){
    const response = await api.get(`/subscriptions/${subscriberId}/subscribedChannels`)
    return response.data;
}

export default {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}