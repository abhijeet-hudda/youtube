import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../api/comment.api";

export const commentKeys = {
    all: ['comments'],
    videoComments: (videoId) => [...commentKeys.all, 'video', videoId],
};

export const useVideoComments = (videoId, params) => {
    return useQuery({
        queryKey: commentKeys.videoComments(videoId),
        queryFn: () => commentApi.getVideoComments(videoId, params),
        enabled: !!videoId,
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useAddComment = (videoId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content) => commentApi.addComment(videoId, content),
        onSuccess: () => {
            // Refetch the list so the new comment appears
            queryClient.invalidateQueries({ queryKey: commentKeys.videoComments(videoId) });
        }
    });
};

export const useUpdateComment = (videoId, commentId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newContent) =>
      commentApi.updateComment(commentId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.videoComments(videoId),
      });
    },
  });
};

export const useDeleteComment = (videoId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId) => commentApi.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.videoComments(videoId) });
        }
    });
};