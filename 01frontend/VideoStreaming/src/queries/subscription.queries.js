import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subscriptionApi from "../api/subscription.api";
import toast from "react-hot-toast";

export const subscriptionKeys = {
    all: ["subscriptions"],
    lists: () => [...subscriptionKeys.all, "list"],
    subscribers: (channelId) => [...subscriptionKeys.lists(), "subscribers", channelId],
    subscribed: (subscriberId) => [...subscriptionKeys.lists(), "subscribed", subscriberId]
};

export const useUserChannelSubscribers = (channelId) => {
    return useQuery({
        queryKey: subscriptionKeys.subscribers(channelId),
        queryFn: () => subscriptionApi.getUserChannelSubscribers(channelId),
        enabled: !!channelId,
        staleTime: 30_000, 
    });
};

export const useSubscribedChannels = (subscriberId) => {
    return useQuery({
        queryKey: subscriptionKeys.subscribed(subscriberId),
        queryFn: () => subscriptionApi.getSubscribedChannels(subscriberId),
        enabled: !!subscriberId,
        staleTime: 30_000,
    });
};

export const useToggleSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (channelId) => subscriptionApi.toggleSubscription(channelId),
        onSuccess: (data, channelId) => {
            // "data" usually contains the boolean status (subscribed: true/false) if your backend sends it
            
            // 1. Invalidate the list of channels the current user is subscribed to
            // (Because they just added/removed one)
            queryClient.invalidateQueries({ 
                queryKey: subscriptionKeys.lists() 
            });

            // Optional: If you want to force refresh the specific channel's sub count immediately:
            queryClient.invalidateQueries({
                 queryKey: subscriptionKeys.subscribers(channelId) 
            });
            
            toast.success("Subscription updated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to toggle subscription");
        }
    });
};