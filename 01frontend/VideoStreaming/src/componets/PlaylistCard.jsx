import React, { use } from "react";
import { ListVideo, Lock, Globe, Trash2 } from "lucide-react";
import { useVideoDetail } from "../queries/video.queries";

function PlaylistCard({ playlist}) {
  //console.log("card",playlist)
  const videoId = playlist.video?.length > 0 ? playlist.video[0]:null;
  //console.log(videoId)
  const {data,isLoading,error} = useVideoDetail(videoId);
  //console.log("video",data)  
  const videoCount = playlist.video?.length || 0;
//   const handleDeleteClick = (e) => {
//     e.stopPropagation(); // Prevent navigating when clicking delete
//     if(onDelete) onDelete(playlist._id);
//   };

  return (
    <div className="group w-full cursor-pointer flex flex-col gap-2"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
        
        {/* Main Image */}
        <img
          src={data?.thumbnail}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Playlist Overlay (Right Side Bar) */}
        <div className="absolute inset-y-0 right-0 w-[35%] bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-1 group-hover:bg-black/90 transition-colors">
          <span className="text-sm font-semibold">{videoCount}</span>
          <ListVideo size={24} />
        </div>

        {/* Play All Overlay (Optional: Appears on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="uppercase tracking-wider font-bold text-white text-sm">Play All</span>
        </div>
      </div>

      {/* --- TEXT INFO --- */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-base text-black line-clamp-2 leading-tight group-hover:text-blue-600">
            {playlist.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="capitalize">
                {playlist.description || "No description"}
            </span>
          </div>
        </div>

        {/* Optional: Delete Button (Only for owner) */}
        {/* {isOwner && (
            <button 
                onClick={handleDeleteClick}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                title="Delete Playlist"
            >
                <Trash2 size={16} />
            </button>
        )} */}
      </div>
    </div>
  );
}

export default PlaylistCard;