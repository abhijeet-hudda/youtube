import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../../componets/Button";
import Input from "../../componets/Input";

// 🔹 Thunks
import {
  updateCoverImage,
  fetchCurrentUser,
} from "../../store/features/authFeatures/auth.Thunks";

// 🔹 Slice reducer (IMPORTANT)
import {
  updateUserCoverImage,
} from "../../store/features/authFeatures/auth.slice";

function UpdateCoverImage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isLoading } = useSelector((state) => state.auth);

  const [preview, setPreview] = useState(user?.coverImage || "");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const coverImageFile = watch("coverImage");

  // 🔹 Live preview
  useEffect(() => {
    if (coverImageFile && coverImageFile.length > 0) {
      const file = coverImageFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [coverImageFile]);

  const updateCoverImageFn = async (data) => {
    const formData = new FormData();
    formData.append("coverImage", data.coverImage[0]);

    try {
      const response = await dispatch(updateCoverImage(formData)).unwrap();
      dispatch(updateUserCoverImage(response.data.coverImage));
      dispatch(fetchCurrentUser());
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
        exact: false,
      });
      //queryClient.invalidateQueries({ queryKey: ["channel"] });

      toast.success("Cover image updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Failed to update cover image");
    }
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl bg-gray-300 rounded-2xl p-8 gap-8 border border-black/10">
        <div className="relative">
          <img
            src={preview || "https://via.placeholder.com/600x200"}
            alt="Cover Preview"
            className="w-64 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold mb-4">
            Change Cover Image
          </h2>

          <form
            onSubmit={handleSubmit(updateCoverImageFn)}
            className="space-y-4"
          >
            <Input
              type="file"
              accept="image/*"
              {...register("coverImage", {
                required: "Please select an image",
              })}
            />

            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Save Cover Image"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCoverImage;
