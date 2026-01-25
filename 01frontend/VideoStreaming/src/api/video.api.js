import api from "./axios.instance";

async function getAllVideos({
  page = 1,
  limit = 10,
  query,
  sortBy,
  sortType,
  userId,
} = {}) {
  const response = await api.get("/videos", {
    params: {
      page,
      limit,
      query,
      sortBy,
      sortType,
      userId,
    },
  });
  //console.log("video",response.data.data.docs)
  return response.data;
}

async function publishVideo(formData) {
  const response = await api.post("/videos/publish", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
async function getVideoById(videoId) {
  const response = await api.get(`/videos/${videoId}`);
  //console.log("getvideoById",response)
  return response.data;
}
async function updateVideo(videoId, formData) {
  const response = await api.patch(`/videos/updateVideo/${videoId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export default {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo
}
