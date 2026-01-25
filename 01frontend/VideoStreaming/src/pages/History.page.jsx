import VideoCard from "../componets/VideoCard"; 
import Container from "../componets/container/Container"; 
import { watchHistory } from "../store/features/historyFeatures/history.Thunks";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
function History() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(watchHistory());
    },[dispatch])
    const {historyVideo, isLoading,error} = useSelector((state)=>state.history)
    //console.log("historyVideo",historyVideo)
    if (isLoading) {
        return <div className="text-white text-center mt-10">Loading history...</div>;
    }

    return (
        <div className="w-full min-h-screen  text-black py-8">
            <Container>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <h3 className="text-2xl font-bold">Watch History</h3>
                </div>

                {historyVideo && historyVideo.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {historyVideo.map((video) => (
                            <div key={video._id} className="w-full">
                                {/* passing the specific history video object */}
                                <VideoCard videoObject={video} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-black">
                        <p className="text-lg">This list has no videos.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default History;