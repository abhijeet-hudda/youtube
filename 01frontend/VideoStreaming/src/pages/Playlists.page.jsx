import React from "react";
import { useSelector } from "react-redux";
import PlaylistCard from "../componets/PlaylistCard";
import { useUserPlaylists } from "../queries/playlist.queries";
import Container from "../componets/container/Container"; 
import { Link} from "react-router-dom";

function PlaylistPage() {
    const { user } = useSelector((state) => state.auth);
    const userId = user?.user?._id;
    const { data, isLoading, error } = useUserPlaylists(userId);
    //console.log(data)
    const playlists = data?.data?.playlists|| []
    //console.log("playlists",playlists)
    if (isLoading) {
        return (
            <div className="w-full h-[50vh] flex flex-col justify-center items-center">
                <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading your playlists...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="w-full h-[50vh] flex justify-center items-center text-red-500 font-semibold">
                <p>Failed to load playlists. Please try again later.</p>
            </div>
        );
    }
    return (
        <Container>
            <div className="w-full py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-black">My Playlists</h1>
                </div>
                {!playlists || playlists.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-200 p-6 rounded-full mb-4">
                            <span className="text-4xl">📂</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">No Playlists Created</h3>
                        <p className="text-gray-500 mt-2">
                            You haven't created any playlists yet. Go to a video and click "Save" to start!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {playlists.map((playlist) => (
                            <Link to={`/watch/${playlist.video[0]}`}  key={playlist._id} >
                                <PlaylistCard 
                                   
                                    playlist={playlist}
                                    isOwner={true} 
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}

export default PlaylistPage;