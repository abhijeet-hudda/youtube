import React, { useState } from 'react';

function CommentCard({ comment }) {
  // Destructure props (adjust keys to match your backend API)
  //console.log(comment);
  const { 
    content, 
    owner,
    createdAt, 
  } = comment;

//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);

//   // Toggle Logic
//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//     if (isDisliked) setIsDisliked(false);
//   };

//   const toggleDislike = () => {
//     setIsDisliked(!isDisliked);
//     if (isLiked) setIsLiked(false);
//   };

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
          <span className="text-gray-400 text-xs">
          </span>
        </div>

        {/* Comment Text */}
        <div className="text-black text-[14px] leading-snug whitespace-pre-wrap mb-2">
          {content}
        </div>

        {/* Action Buttons (Like, Dislike, Reply) */}
        <div className="flex items-center gap-4 text-gray-300">
          
          {/* Like Button */}
          {/* <div className="flex items-center gap-1 cursor-pointer" onClick={toggleLike}>
             {isLiked ? (
               // Filled Thumbs Up
               <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></svg>
             ) : (
               // Outline Thumbs Up
               <svg className="w-6 h-6 hover:fill-gray-500 fill-transparent stroke-current stroke-1" viewBox="0 0 24 24"><path fill="currentColor" d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.22-1.55,0.63L7,10.13V21h10.8 c0.71,0,1.36-0.37,1.72-1l3.45-6.33C22.97,13.67,23,13.43,23,13.17V11C23,11,18.77,11,18.77,11z M7,20H3V10h4V20z"></path></svg>
             )}
             <span className="text-xs text-gray-400">{likesCount || ""}</span>
          </div> */}

          {/* Dislike Button */}
          {/* <div className="cursor-pointer" onClick={toggleDislike}>
             {isDisliked ? (
                // Filled Thumbs Down
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg>
             ) : (
                // Outline Thumbs Down
                <svg className="w-6 h-6 hover:fill-gray-500 fill-transparent stroke-current stroke-1" viewBox="0 0 24 24"><path fill="currentColor" d="M17,4h-4v10l-5.83-5.51C6.78,8.08,6.22,7.86,5.64,7.86c-1.16,0-2,1.03-1.68,2.06l1.52,4.94H1.23 C1.23,14.86,1,15.1,1,15.37v2.17c0,0.26,0.03,0.5,0.03,0.5L4.48,24.37C4.84,25,5.49,25.37,6.2,25.37H17V4z M21,4h-3v11h3V4z"></path></svg>
             )}
          </div> */}

          {/* Reply Button */}
          <button className="text-xs text-black font-semibold hover:bg-gray-700/50 py-1 px-3 rounded-full">
            Reply
          </button>
        </div>
      </div>

      {/* 3. Three-dot Menu (Hidden until hover, like YouTube) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-gray-800 rounded-full">
            {/* 3-dots SVG */}
           <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" ><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
        </button>
      </div>

    </div>
  );
}

export default CommentCard;