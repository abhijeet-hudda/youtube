import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import videoApi from "../api/video.api"; 
import { toast } from "react-hot-toast"; // Recommended for production feedback

export const videoKeys = {
    all: ["videos"],
    lists: () => [...videoKeys.all, "list"],
    list: (filters) => [...videoKeys.lists(), { ...filters }],
    details: () => [...videoKeys.all, "detail"],
    detail: (id) => [...videoKeys.details(), id],
};

// 1. Fetching Hook
export const useVideos = (filters) => {
    return useQuery({
        queryKey: videoKeys.list(filters),
        queryFn: () => videoApi.getAllVideos(filters),
        placeholderData: (previousData) => previousData, // Newer version of keepPreviousData
        staleTime: 5 * 60 * 1000,
        //staleTime is the amount of time React Query considers fetched data “fresh.”
    });
};

/*
    placeholder data
    Page change
    ↓
    Old data shown(insted of data = undefined)
    ↓
    New data fetched in background
    ↓
    UI updates smoothly
*/



// 2. Fetching Detail Hook
export const useVideoDetail = (videoId) => {
    return useQuery({
        queryKey: videoKeys.detail(videoId),
        queryFn: () => videoApi.getVideoById(videoId),
        enabled: !!videoId,
        select: (response) => response?.data, // Clean up the data structure before it hits components
    });
};

// 3. Mutation Hook with Feedback
export const usePublishVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => videoApi.publishVideo(formData),
        onSuccess: () => {
            toast.success("Video published successfully!");
            queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Upload failed");
        }
    });
};

// 4. Update Hook
export const useUpdateVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, formData }) => videoApi.updateVideo(videoId, formData),
        onSuccess: (_, variables) => {
            toast.success("Video updated!");
            // Refetch lists and specific detail
            queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: videoKeys.detail(variables.videoId) });
        },
    });
};