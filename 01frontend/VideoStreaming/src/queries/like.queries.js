import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import likeApi from "../api/like.api";
import toast from "react-hot-toast";

export const likeKeys = {
    all: ["likes"],
    likedVideos: () => [...likeKeys.all, "videos"],
};

export const useGetLikedVideos = () => {
    return useQuery({
        queryKey: likeKeys.likedVideos(),
        queryFn: likeApi.getLikedVideos,
        staleTime: 60 * 1000,
        retry: 2, // Retry twice if the request fails
    });
};

export const useToggleVideoLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId) => likeApi.toggleVideoLike(videoId),
        onSuccess: (data, videoId) => {
            // 1. Refetch the "Liked Videos" page so the new video appears/disappears
            queryClient.invalidateQueries({ queryKey: likeKeys.likedVideos() });

            // 2. (Optional) Invalidate the specific video to update its like count on the UI
            queryClient.invalidateQueries({ queryKey: ['videos', 'detail', videoId] });
            
            toast.success("Video like updated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to like video");
        }
    });
};

export const useToggleTweetLike = () => {
    // Note: We don't invalidate likedVideos here because tweets don't appear in that list
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tweetId) => likeApi.toggleTweetLike(tweetId),
        onSuccess: (data, tweetId) => {
            // Invalidate the specific tweet to update the like count/icon color
            //queryClient.invalidateQueries({ queryKey: ['tweets', 'detail', tweetId] });
            toast.success("Tweet like updated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to like tweet");
        }
    });
};

export const useToggleCommentLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => likeApi.toggleCommentLike(commentId),
        onSuccess: (data, commentId) => {
            
            toast.success("Comment like updated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to like comment");
        }
    });
};