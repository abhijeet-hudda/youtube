import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Button from "../../componets/Button";
import Input from "../../componets/Input";
import { updateCoverImage } from "../../store/features/authFeatures/auth.Thunks";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UpdateCoverImage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading } = useSelector((state) => state.auth);
    
    // Local state for image preview
    const [preview, setPreview] = useState(user?.user?.coverImage || ""); 

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // Watch the avatar input field to update preview live
    const coverImageFile = watch("coverImage");

    useEffect(() => {
        if (coverImageFile && coverImageFile.length > 0) {
        // Create a temporary URL for the selected file
        const file = coverImageFile[0];
        setPreview(URL.createObjectURL(file));
        }
    }, [coverImageFile]);

    const updateCoverImageFn = async(data)=>{
        console.log(data);
        const formData = new FormData();
        formData.append("coverImage", data.coverImage[0]); 
        try {
            await dispatch(updateCoverImage(formData)).unwrap();
            toast.success("CoverImage updated successfully!");
            navigate("/");
        } 
        catch (error) {
            toast.error("Failed to update coverImage");
        }
    }


    return (
        <div className="w-full flex justify-center mt-10">
        <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl bg-gray-300 rounded-2xl p-8 gap-8 border border-black/10">
            <div className="relative">
                <img
                src={preview || "https://via.placeholder.com/150"} 
                alt="coverImage Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
            </div>
            <div className="flex-1 w-full">
                <h2 className="text-xl font-bold text-black mb-4">Change Cover Image</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Choose a new image to update your cover image.
                </p>

                <form onSubmit={handleSubmit(updateCoverImageFn)} className="space-y-4">
                    <Input
                        type="file"
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100 cursor-pointer"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("coverImage", { required: "Please select an image" })}
                    />
                    {errors.coverImage && (
                        <p className="text-red-500 text-sm">{errors.coverImage.message}</p>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full sm:w-auto mt-2" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Uploading..." : "Save coverImage"}
                    </Button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default UpdateCoverImage;