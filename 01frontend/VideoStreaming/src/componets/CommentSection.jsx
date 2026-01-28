import React, { useState } from "react";
import { useVideoComments, useAddComment } from "../queries/comment.queries";
import CommentCard from "./CommentCard";

function CommentSection(videoId) {
  const [isCommentBoxFocused, setIsCommentBoxFocused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const params = {
    page: 1,
    limit: 15,
  };

  const { data, isLoading, isError, error, isFetching } = useVideoComments(
    videoId,
    params,
  );
  //console.log("comment data", data);
  //console.log("error", error);
  const allComments = data?.data?.docs || [];
  //console.log("array",allComments)

  const { mutate: addComment } = useAddComment(videoId);
  const handleAddComment = () => {
    addComment(commentText);
    setCommentText("");
    setIsCommentBoxFocused(false);
  };
  const handleCancelComment = () => {
    setCommentText("");
    setIsCommentBoxFocused(false);
  };
  
  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>{error.message}</p>;
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">{allComments.length} Comments</h3>

      {/* Comment Input Section */}
      <div className="flex gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0"></div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsCommentBoxFocused(true)}
            className="w-full border-b border-gray-300 focus:border-black focus:border-b-2 outline-none py-1 transition-all bg-transparent"
          />
          {(isCommentBoxFocused || commentText) && (
            <div className="flex justify-end gap-3 mt-3 animate-fade-in">
              <button
                onClick={handleCancelComment}
                className="px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  commentText.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment List Section */}
      <div className="flex flex-col gap-6">
        {allComments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
