import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subscriptionApi from "../api/subscription.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userChannel } from "../store/features/channelFeatures/channel.Thunks";

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

export const useToggleSubscription = (username) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId) =>
      subscriptionApi.toggleSubscription(channelId),

    onSuccess: (_, channelId) => {
      if (username) {
        dispatch(userChannel(username));
      }
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.all,
        exact: false,
      });

      toast.success("Subscription updated");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to toggle subscription"
      );
    },
  });
};
