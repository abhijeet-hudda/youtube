import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import tweetApi from "../api/tweet.api"; // Adjust path as needed
import toast from "react-hot-toast";

export const tweetKeys = {
    all: ["tweets"],
    lists: () => [...tweetKeys.all, "list"],
    userTweets: (userId) => [...tweetKeys.lists(), "user", userId],
    detail: (tweetId) => [...tweetKeys.all, "detail", tweetId], 
};

export const useGetUserTweets = (userId) => {
    return useQuery({
        queryKey: tweetKeys.userTweets(userId),
        queryFn: () => tweetApi.getUserTweets(userId),
        enabled: !!userId,
        staleTime: 60 * 1000,
    });
};


export const useCreateTweet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content) => tweetApi.createTweet(content),
        onSuccess: () => {
            toast.success("Tweet posted!");
            // Invalidate all tweet lists so the new tweet appears everywhere
            queryClient.invalidateQueries({ queryKey: tweetKeys.lists() });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to post tweet");
        }
    });
};

export const useUpdateTweet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tweetId, content }) => tweetApi.updateTweet(tweetId, content),
        onSuccess: (data, variables) => {
            toast.success("Tweet updated");
            
            // Refresh the specific user's list (if you know the userId, otherwise refresh all lists)
            queryClient.invalidateQueries({ queryKey: tweetKeys.lists() });
            
            // If you have a 'single tweet' view, refresh that too:
             queryClient.invalidateQueries({ queryKey: tweetKeys.detail(variables.tweetId) });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update tweet");
        }
    });
};