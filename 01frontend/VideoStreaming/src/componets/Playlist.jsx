import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Input from "../componets/Input";
import Button from "../componets/Button";
import toast from "react-hot-toast";
import { useUserPlaylists, useCreatePlaylist, useAddVideoToPlaylist } from "../queries/playlist.queries"; 

const Playlist = ({ videoId, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  //console.log("playlist user",user);
  const userId = user.user?._id;
  //console.log("userId",userId)

  const { data, isLoading } = useUserPlaylists(userId);
  //console.log("data",data)
  const allPlaylists =  data?.data.playlists || []; 
  //console.log("allplaylists",allPlaylists)
  const { mutateAsync: createPlaylistMutate } = useCreatePlaylist();
  const { mutateAsync: toggleVideoMutate } = useAddVideoToPlaylist();

  const{register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm();
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  // --- HANDLERS ---

  // Handle Create Playlist
  const onCreatePlaylist = async (formData) => {
    try {
      await createPlaylistMutate(formData);
      reset(); // Clear form
      setShowCreateForm(false); // Go back to list
    } catch (error){
      toast.error("Failed to create playlist");
      console.error(error);
    }
  };

  // Handle Checkbox Toggle (Add/Remove Video)
  const handleTogglePlaylist = async (playlistId, isChecked) => {
    try {
        // Optimistic UI updates are handled by React Query cache invalidation usually
        await toggleVideoMutate({ videoId, playlistId });
    } catch (error) {
        toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white text-black w-full max-w-xs md:max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" 
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Save to...</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* PLAYLIST LIST */}
        {!showCreateForm ? (
          <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
            {isLoading ? (
                <p className="text-center p-4 text-gray-500">Loading playlists...</p>
            ) : allPlaylists.length === 0 ? (
                <p className="text-center p-4 text-gray-500">No playlists found.</p>
            ) : (
                allPlaylists.map((playlist) => {
                    // Check if current video is already in this playlist
                    const isVideoPresent = playlist.videos?.includes(videoId); 

                    return (
                        <label 
                          key={playlist._id} 
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                        >
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-sm checked:bg-blue-600 checked:border-blue-600 transition-colors"
                              checked={isVideoPresent}
                              onChange={() => handleTogglePlaylist(playlist._id, isVideoPresent)}
                            />
                            <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={4} />
                          </div>
                          <span className="flex-1 text-sm font-medium truncate">{playlist.name}</span>
                        </label>
                    );
                })
            )}
          </div>
        ) : null}

        {/*  CREATE FORM */}
        <div className="p-4 pt-2">
          {!showCreateForm ? (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-3 w-full p-2 py-3 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Plus size={24} className="text-black" />
              <span className="font-medium">New playlist</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit(onCreatePlaylist)} className="mt-2 space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Name</label>
                    <Input 
                        placeholder="Enter playlist name..." 
                        autoFocus
                        className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-black placeholder-gray-400 transition-colors"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>
                
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Description</label>
                    <Input 
                        placeholder="Write playlist description..." 
                        className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-black placeholder-gray-400 transition-colors"
                        {...register("description")}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button 
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 text-black hover:bg-gray-300 rounded-full transition"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 transition"
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;