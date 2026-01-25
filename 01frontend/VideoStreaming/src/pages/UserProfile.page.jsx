import {useSelector,useDispatch} from "react-redux"
import { useParams,Link} from "react-router-dom"
import {useVideos} from "../queries/video.queries"
import { useEffect,useState } from "react";
import { userChannel } from "../store/features/channelFeatures/channel.Thunks";
import {useToggleSubscription} from '../queries/subscription.queries'

function UserProfilePage(){
    const {username} = useParams();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("Videos");
    useEffect(() => {
        if (username) {
            dispatch(userChannel(username));
        }
    }, [username, dispatch]);
    const { channelProfile } = useSelector((state) => state.channel);
    const { mutate: toggleSubscription, isPending: subLoading } =
    useToggleSubscription(username);

    const handleSubscription = () => {
    if (!subLoading && channelProfile?._id) {
      toggleSubscription(channelProfile._id);
    }
  };
    //console.log("channelProfile user",channelProfile)
    const { data, error, isLoading } = useVideos({
        userId: channelProfile?._id,
        page: 1,
        limit: 10,
    });
    const allVideos = data?.data?.docs || [];

    const formatCount = (num) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    };
    
    return (
        <div className="w-full bg-gray-100 min-h-screen text-black pb-10">
            {/*this is for coverImage */}
            <div className="w-full h-32 md:h-52 overflow-hidden">
                {channelProfile?.coverImage ? (
                    <img 
                        src={channelProfile.coverImage} 
                        alt="cover" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                )}
            </div>
            {/*this is for avatar (fullname,username subscriber,videos) */}
            <div className="max-w-7xl max-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6 pb-4 border-b border-gray-700">
                    <div className="shrink-0">
                        <img 
                            src={channelProfile?.avatar || "https://via.placeholder.com/150"} 
                            alt={channelProfile?.fullName} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#0f0f0f]"
                        />
                    </div>
                    <div className="flex flex-col gap-2  text-center md:text-left">
                        <h1 className="text-3xl font-bold">{channelProfile?.fullName}</h1>
                        <div className="text-black text-sm font-medium flex flex-wrap justify-center md:justify-start gap-2">
                            <span>@{channelProfile?.username}</span>
                            <span>•</span>
                            <span>{channelProfile?.channelSubscriberCount || 0} subscribers</span>
                            <span>•</span>
                            <span>{allVideos?.length || 0} videos</span>
                        </div>
                        <p className="text-black text-sm max-w-2xl line-clamp-2">
                           {channelProfile?.description || "Welcome to the official channel..."}
                           <span className="text-black cursor-pointer ml-1 font-semibold">...more</span>
                        </p>
                        <div className="mt-2">
                            <button onClick={handleSubscription}  disabled={subLoading} className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                                {channelProfile?.isSubscribed ? "Unsubscribe" : "Subscribe"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*this for all videos*/}
            <div className="flex gap-8 border-b border-gray-700 text-black font-medium mt-2 overflow-x-auto px-4">
                    {["Videos", "Playlists"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 uppercase border-b-2 transition whitespace-nowrap ${
                                activeTab === tab 
                                ? "border-white text-orange-500" 
                                : "border-transparent hover:text-orange-200"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
            </div>
            <div className="mt-6">
                    {/* Filter Chips (Latest, Popular, Oldest) */}
                    {/* <div className="flex gap-3 mb-6">
                        {["Latest", "Popular", "Oldest"].map((filter, index) => (
                            <button 
                                key={filter} 
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    index === 0 ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div> */}

                    {/* Video Grid */}
                    {allVideos && allVideos?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                            {allVideos?.map((video) => (
                                <Link to={`/watch/${video?._id}`} key={video._id}>
                                    <div  className="flex flex-col gap-2 cursor-pointer group">
                                        {/* Thumbnail Wrapper */}
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                                            <img 
                                                src={video.thumbnail} 
                                                alt={video.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                                                {formatDuration(video.duration)}
                                            </span>
                                        </div>
                                        
                                        {/* Video Title & Meta */}
                                        <div>
                                            <h3 className="font-semibold text-black line-clamp-2 group-hover:text-gray-600">
                                                {video.title}
                                            </h3>
                                            <div className="text-black text-sm mt-1">
                                                <span>{formatCount(video.views)} views</span>
                                                <span className="mx-1">•</span>
                                                <span>{formatDate(video.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 mt-10">
                            No videos available.
                        </div>
                    )}
                </div>
        </div>
    )

}

// Simple Helper functions for display
function formatDuration(seconds) {
    if(!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

export default UserProfilePage;