import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import playlistApi from "../api/playlist.api";
import toast from "react-hot-toast";

export const playlistKeys = {
    all: ["playlists"],
    lists: () => [...playlistKeys.all, "list"],
    list: (userId) => [...playlistKeys.lists(), "user", userId],
    details: () => [...playlistKeys.all, "detail"],
    detail: (playlistId) => [...playlistKeys.details(), playlistId],
};

// --- QUERIES ---

export const useUserPlaylists = (userId) => {
    return useQuery({
        queryKey: playlistKeys.list(userId),
        queryFn: () => playlistApi.getUserPlaylists(userId),
        enabled: !!userId, // Only run if userId exists
        staleTime: 30_000,
    });
};

export const useGetPlaylist = (playlistId) => {
    return useQuery({
        queryKey: playlistKeys.detail(playlistId),
        queryFn: () => playlistApi.getPlaylistById(playlistId),
        enabled: !!playlistId,
        staleTime: 30_000,
    });
};

// --- MUTATIONS ---

export const useCreatePlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: playlistApi.createPlaylist,
        onSuccess: () => {
            toast.success("Playlist created successfully");
            // Invalidate all lists to show the new playlist in the user's view
            queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create playlist");
        }
    });
};

export const useAddVideoPlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // Mutations take a single argument object
        mutationFn: ({ videoId, playlistId }) => 
            playlistApi.addVideoToPlaylist({ videoId, playlistId }),
        onSuccess: (_, variables) => {
            toast.success("Video added to playlist");
            // Invalidate the specific playlist that was modified
            queryClient.invalidateQueries({ queryKey: playlistKeys.detail(variables.playlistId) });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to add video");
        }
    });
};

export const useUpdatePlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ playlistId, name, description }) => 
            playlistApi.updatePlaylist({ playlistId, name, description }),
        onSuccess: (data, variables) => {
            toast.success("Playlist updated");
            // Update the specific detail view
            queryClient.invalidateQueries({ queryKey: playlistKeys.detail(variables.playlistId) });
            // Update lists because names might have changed
            queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Update failed");
        }
    });
};