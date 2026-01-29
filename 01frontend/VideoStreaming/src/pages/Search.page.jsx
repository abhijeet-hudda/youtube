import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVideos } from "../queries/video.queries";
import Container from "../componets/container/Container.jsx";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  console.log("query",query)
  const { data, isLoading, error, refetch } = useVideos({ 
    query: query, 
    sortBy: "relevance" // Optional: backend sort logic
  });
  console.log("data",data)
  const videos = data?.data?.docs || [];
  useEffect(() => {
    refetch();
  }, [query, refetch]);

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col gap-4 py-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-90 h-50 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
      </Container>
    );
  }

  if (videos.length === 0) {
    return (
        <Container>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try different keywords for "{query}"</p>
            </div>
        </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4">
        {/* Filter Bar (Optional) */}
        {/* <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100">
             <button className="px-4 py-1.5 bg-black text-white rounded-lg text-sm font-medium">All</button>
             <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">Shorts</button>
             <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">Videos</button>
             <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">Unwatched</button>
        </div> */}

        {videos.map((video) => (
          <SearchVideoCard key={video._id} video={video} />
        ))}
      </div>
    </Container>
  );
}

// 3. Sub-component: Horizontal Card (Specific to Search Results)
function SearchVideoCard({ video }) {
    return (
        <Link to={`/watch/${video._id}`} className="flex flex-col md:flex-row gap-4 group cursor-pointer">
            {/* Thumbnail */}
            <div className="relative w-full md:w-90 md:h-50 shrink-0 rounded-xl overflow-hidden">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {/* Convert duration seconds to 00:00 format here */}
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
            </div>

            {/* Details */}
            <div className="flex flex-col py-1 flex-1">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-black line-clamp-2 leading-tight mb-1">
                    {video.title}
                </h3>
                
                {/* Meta Data */}
                <p className="text-xs text-gray-500 mb-3">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>

                {/* Channel Info */}
                <div className="flex items-center gap-2 mb-3">
                    <img 
                        src={video.owner?.avatar || "https://ui-avatars.com/api/?background=random"} 
                        alt={video.owner?.username}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500 hover:text-black font-medium">
                        {video.owner?.username}
                    </span>
                </div>

                {/* Description Snippet */}
                <p className="text-xs md:text-sm text-gray-500 line-clamp-2 md:line-clamp-1">
                    {video.description}
                </p>
            </div>
        </Link>
    );
}

export default SearchPage;