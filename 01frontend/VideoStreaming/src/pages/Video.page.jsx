
import { useVideoDetail } from "../queries/video.queries";
import { useParams} from "react-router-dom";
import Container from "../componets/container/Container";
import { useSelector, useDispatch } from "react-redux";
import { userChannel } from "../store/features/channelFeatures/channel.Thunks";
import { useEffect,useRef, useState } from "react";
import { useToggleVideoLike } from "../queries/like.queries";
import {useToggleSubscription} from '../queries/subscription.queries'
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useDeleteVideo } from "../queries/video.queries";
import Playlist from "../componets/Playlist";
import {fetchCurrentUser} from "../store/features/authFeatures/auth.Thunks"
import CommentSection from "../componets/CommentSection";

function Video() {
  //videoId => getVideoByID => display video
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videoId } = useParams();
  //console.log("videoId", videoId);
  const { data, error, isLoading } = useVideoDetail(videoId);
  const username = data?.owner?.username;
  //for like updation 
  const { mutate: toggleLike, } = useToggleVideoLike();
  const handleLike = () => {
    toggleLike(videoId);
  };
  const { channelProfile } = useSelector((state) => state.channel); 
  useEffect(() => {
    if (username) {
      dispatch(userChannel(username));
    }
  }, [username, dispatch]); 
  const { mutate: toggleSubscription, isPending: subLoading } =
    useToggleSubscription(username);

  const handleSubscription = () => {
    if (!subLoading && channelProfile?._id) {
      toggleSubscription(channelProfile._id);
    }
  };
  const {mutate:deleteVideo} = useDeleteVideo(navigate);
  const handleDelete =async() => {
    deleteVideo(videoId);
  }
  const [isPlayListOpen,setIsPlayListOpen] = useState(false)
  
  // useEffect(()=>{
  //   dispatch(fetchCurrentUser());
  // },[dispatch])
  //console.log("channelProfile", channelProfile);
  //console.log("data",data);

  /*
    data ke ander 
    "data": {
        "_id": "695f6cc9b8aa7d46ff454193",
        "videofile": "http://res.cloudinary.com/dvdqxwfuv/video/upload/v1767861420/tfefbqwxliwt74izbnvy.mp4",
        "thumbnail": "http://res.cloudinary.com/dvdqxwfuv/image/upload/v1767877447/kta6nh1hje5jaoddn4xi.png",
        "title": "campus",
        "description": "IIT ISM",
        "duration": 57.433333,
        "views": 0,
        "isPublished": true,
        "owner": "695b39ef146056e75953ac0c",
        "createdAt": "2026-01-08T08:37:29.572Z",
        "updatedAt": "2026-01-08T13:04:29.183Z",
        "__v": 0
    },
  */
  const formatViews = (views = 0) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views;
  };
  
  if (isLoading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading video...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full py-20 text-center">
        <h2 className="text-xl text-red-500">Something went wrong</h2>
        <p className="text-gray-600">{error.message || "Video not found"}</p>
      </div>
    );
  }
  return (
    <Container>
      <div className="flex flex-col lg:flex-row gap-6 py-4 ">
        {/* left colum */}
        <div className="flex-1 lg:w-[70%]">
          {/*video ke liye */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
            <video
              src={data.videofile}
              poster={data.thumbnail}
              controls
              autoPlay
              className="w-full h-full object-contain"
            ></video>
          </div>
          <h1 className="text-xl md:text-2xl fond-bold mt-4 line-clamp-2 bg-gray-100 rounded-xl">
            {data.title}
          </h1>
          {/*owner ke liye  */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-4 bg-gray-100 rounded-xl ">
            {/*image username */}
            <div className="flex items-center gap-3 ">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full  overflow-hidden bg-gray-300 shrink-0">
                {/*yha image dalni h owner ki*/}
                
                  <img
                    src={data.owner.avatar || "https://i.pravatar.cc/40"}
                    alt="owner"
                    className="w-full h-full object-cover"
                    onClick={(e) => {
                      e.stopPropagation();      
                      e.preventDefault();     
                      navigate(`/${data?.owner?.username}`);
                    }}
                  />
              </div>
              <div className="text-black">
                <h3 className="font-semibold text-sm  md:text-base">
                  {/*usename dalna h*/}{data.owner.username}
                </h3>
                <p className="text-xs">
                  Subscribers {/*yha subscriber dalne h */}{channelProfile?.channelSubscriberCount || 0}{" "}
                </p>
              </div>
              <button onClick={handleSubscription}  disabled={subLoading} className="ml-4 px-5 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-all">
               {channelProfile?.isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
            {/*like share button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-300 rounded-full overflow-hidden">
                <button onClick={handleLike} className="px-4 py-2 hover:bg-gray-400 flex items-center gap-2 border-r border-gray-300 transition-colors">
                  <span>👍</span>{" "}
                  <span className="text-sm font-medium">Like {data.likeCount}</span>
                </button>
                <button className="px-4 py-2 hover:bg-gray-400 transition-colors">
                  👎
                </button>
              </div>
              <button className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 font-medium text-sm transition-colors">
                Share
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 font-medium text-sm transition-colors">
                Delete Video
              </button>
              <button 
              onClick={() => setIsPlayListOpen(true)}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 font-medium text-sm transition-colors flex items-center gap-2"
              >
                Save
              </button>
                            

            </div>
          </div>

          {/* description  */}
          <div className="mt-4 bg-gray-300 rounded-2xl p-3 text-sm border">
            <div className="flex gap-2 font-semibold text-gray-700 mb-2">
              <span>{formatViews(data.views)} views</span>
              <span>•</span>
              <span>{timeAgo(data.createdAt)}</span>
            </div>
            <div className={`whitespace-pre-wrap text-gray-800 `}>
              {data.description}
            </div>
            {/*${!isDescExpanded ? 'line-clamp-2' : ''}
                     data.description?.length > 100 && (
                        <button 
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className="mt-1 font-semibold text-gray-600 cursor-pointer hover:text-black"
                        >
                            {isDescExpanded ? "Show less" : "...more"}
                        </button>
                    )*/}
          </div>
          {/*comment ke liye  */}
          <div className="w-full">
            <CommentSection 
            videoId={videoId}
            />
          </div>
        </div>
        {/*right colum */}
        <div className="w-full lg:w-[30%] lg:sitcky lg:top-4 h-fit">
          <h3 className="font-bold text-lg mb-4">Related Videos</h3>
          <div className="flex flex-col gap-3">
            {/*yha related video ki array aayegi */}
          </div>
        </div>
      </div>
      {isPlayListOpen && (
        <Playlist 
          videoId={videoId} 
          onClose={() => setIsPlayListOpen(false)} 
        />
      )}
    </Container>
  );
}

export default Video;


export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};


// ${commentText?.trim() 
//                           ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                           : 'bg-gray-200 text-gray-500 cursor-not-allowed'}