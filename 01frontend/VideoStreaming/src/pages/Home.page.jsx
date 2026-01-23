import React from "react"; // Removed 'use' (not needed here)
import { useVideos } from "../queries/video.queries";
import Container from "../componets/container/Container";
import VideoCard from "../componets/VideoCard";


const VideoSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse"></div>
    <div className="flex gap-2">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
      <div className="w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  </div>
);

function Home() {
  const { data, error, isLoading } = useVideos();
  const allVideos = data?.data?.docs || [];
  //console.log("allVideos",allVideos)
  if (isLoading) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, index) => (
              <VideoSkeleton key={index} />
            ))}
          </div>
        </Container>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-col items-center justify-center h-64">
             <p className="text-red-500 text-lg font-semibold">
                Failed to load videos.
             </p>
             <p className="text-gray-500">{error.message}</p>
             <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
                Retry
             </button>
          </div>
        </Container>
      </div>
    );
  }
  if (allVideos.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
           <h1 className="text-2xl font-bold text-gray-600">
              No videos found.
           </h1>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8 bg-gray-50 min-h-screen">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allVideos.map((video) => (
            <div key={video._id} className="w-full">
               <VideoCard videoObject={video} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;