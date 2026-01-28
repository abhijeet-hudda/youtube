import React, { useState } from "react";
import { useToggleCommentLike } from "../queries/like.queries";
import { useGetCommentById } from "../queries/comment.queries";
import { timeAgo } from "../pages/Video.page";

function CommentCard({ comment }) {
  // Destructure props (adjust keys to match your backend API)
  //console.log(comment);
  const { content, owner, createdAt,_id } = comment;

  const {data,isError,error:errorId} = useGetCommentById(comment?._id)
  // console.log(data);
  // console.log(errorId);
  const likeCount = data?.data[0]?.likeCount

  //   // Toggle Logic
  const { mutate: toggleLike,error } = useToggleCommentLike();
  const handleCommentLike = () => {
    toggleLike(comment?._id);
  };
  //console.log(comment?._id)
  return (
    <div className="flex gap-4 w-full group py-2">
      {/* 1. Avatar Section */}
      <div className="shrink-0">
        <img
          src={owner?.avatar || "https://ui-avatars.com/api/?background=random"}
          alt="user-avatar"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col grow text-sm">
        {/* Header: Username & Time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-black cursor-pointer hover:underline text-[13px]">
            {owner?.username}
          </span>
          <span className="text-black text-xs">{timeAgo(createdAt)}</span>
        </div>

        {/* Comment Text */}
        <div className="text-black text-[14px] leading-snug whitespace-pre-wrap mb-2">
          {content}
        </div>

        {/* Action Buttons (Like, Dislike, Reply) */}
        <div className="flex items-center gap-4 text-gray-600">
          {/* Like Button */}
          <div className="flex items-center bg-gray-300 rounded-full overflow-hidden">
            <button onClick={handleCommentLike} className="px-4 py-2 hover:bg-gray-400 flex items-center gap-2 border-r border-gray-300 transition-colors">
              <span>👍</span>{" "}
              <span className="text-sm font-medium">Like {likeCount}</span>
            </button>
            <button className="px-4 py-2 hover:bg-gray-400 transition-colors">
              👎
            </button>
          </div>

          {/* Reply Button */}
          <button className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 font-medium text-sm transition-colors">
            Reply
          </button>
        </div>
      </div>

      {/* 3. Three-dot Menu (Hidden until hover, like YouTube) */}
      <div className="">
        <button className="p-2 hover:bg-gray-300 rounded-full">
          {/* 3-dots SVG */}
          <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CommentCard;