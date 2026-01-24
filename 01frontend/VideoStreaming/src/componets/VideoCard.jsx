import { Link,useNavigate} from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { use } from "react";


function formatDuration(seconds) {
    if(!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function VideoCard({ videoObject }) {
  const navigate = useNavigate();
  const {
    thumbnail,
    duration,
    createdAt,
    owner,
    title,
    description,
    views,
    _id,
  } = videoObject;
  const { isAuthenticated} = useSelector((state)=>(state.auth))
  

   if(isAuthenticated){
    return (
      <Link to={`/watch/${_id}`} className="group">
        <div className="w-full hover:bg-gray-300 rounded-xl p2">
          <div className="w-full h-full cursor-pointer">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 "
            />

            {/* DURATION */}
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
              {formatDuration(duration)}
            </span>
          </div>
          <div className="mt-3 flex gap-3">
            
              <img
                src={owner?.avatar}
                alt={owner?.username}
                className="h-9 w-9 rounded-full object-cover"
                onClick={(e) => {
                  e.stopPropagation();      
                  e.preventDefault();     
                  navigate(`/${owner?.username}`);
                }}
              />

            
            <div className="flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                {title}{description}
              </h3>

              <p className="mt-1 text-xs text-gray-600">
                {owner?.username}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
        </div>
      </Link>
    );}
}

export default VideoCard;




//{ utils/formatters.js

// export const formatDuration = (seconds) => {
//   const date = new Date(seconds * 1000);
//   const hh = date.getUTCHours();
//   const mm = date.getUTCMinutes();
//   const ss = date.getUTCSeconds().toString().padStart(2, "0");
//   if (hh) {
//     return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
//   }
//   return `${mm}:${ss}`;
// };

// export const formatViews = (number) => {
//   return new Intl.NumberFormat('en-US', {
//     notation: "compact",
//     compactDisplay: "short"
//   }).format(number);
// };

// export const timeAgo = (dateString) => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const seconds = Math.floor((now - date) / 1000);
    
//     let interval = seconds / 31536000;
//     if (interval > 1) return Math.floor(interval) + " years ago";
    
//     interval = seconds / 2592000;
//     if (interval > 1) return Math.floor(interval) + " months ago";
    
//     interval = seconds / 86400;
//     if (interval > 1) return Math.floor(interval) + " days ago";
    
//     interval = seconds / 3600;
//     if (interval > 1) return Math.floor(interval) + " hours ago";
    
//     interval = seconds / 60;
//     if (interval > 1) return Math.floor(interval) + " minutes ago";
    
//     return Math.floor(seconds) + " seconds ago";
// };}
// import React from "react";

// import { Link } from "react-router-dom"; // Assuming you use React Router
// import { formatDuration, formatViews, timeAgo } from "./utils/formatters"; // Import helpers

// function VideoCard({ videoObject }) {
//   // Destructure with default values to prevent crashes
//   const {
//     _id,
//     thumbnail,
//     duration,
//     title,
//     views = 0,
//     createdAt,
//     owner,
//   } = videoObject || {};

//   const { avatar, username } = owner || {};

//   return (
//     <Link 
//         to={`/video/${_id}`} 
//         className="w-full group cursor-pointer" // Group for hover effects
//     >
//       {/* ================= THUMBNAIL SECTION ================= */}
//       <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
//         {/* Main Image */}
//         <img
//           src={thumbnail}
//           alt={title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out bg-gray-200"
//           loading="lazy"
//         />
        
//         {/* Duration Badge */}
//         <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-white text-xs font-medium tracking-wide">
//           {formatDuration(duration)}
//         </div>
//       </div>

//       {/* ================= META DATA SECTION ================= */}
//       <div className="flex gap-x-3 items-start">
        
//         {/* Channel Avatar */}
//         <div className="flex-shrink-0">
//           <Link to={`/channel/${username}`} onClick={(e) => e.stopPropagation()}>
//             <img
//               src={avatar}
//               alt={username}
//               className="w-9 h-9 rounded-full object-cover border border-transparent hover:border-gray-400"
//             />
//           </Link>
//         </div>

//         {/* Text Info */}
//         <div className="flex flex-col overflow-hidden">
          
//           {/* Title */}
//           <h3 className="text-base font-semibold leading-tight text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
//             {title}
//           </h3>

//           {/* Channel Name */}
//           <Link 
//             to={`/channel/${username}`}
//             onClick={(e) => e.stopPropagation()}
//             className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
//           >
//             {username}
//             {/* Optional: Verification Checkmark Icon could go here */}
//           </Link>

//           {/* Views and Time */}
//           <div className="text-sm text-gray-600 mt-0.5">
//             <span>{formatViews(views)} views</span>
//             <span className="mx-1">•</span>
//             <span>{timeAgo(createdAt)}</span>
//           </div>
          
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default VideoCard;