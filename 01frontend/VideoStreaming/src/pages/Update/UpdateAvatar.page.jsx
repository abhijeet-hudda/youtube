import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../componets/Button";
import Input from "../../componets/Input";
import {
  updateAvatar,
  fetchCurrentUser,
} from "../../store/features/authFeatures/auth.Thunks";


import {
  updateUserAvatar,
} from "../../store/features/authFeatures/auth.slice";

function UpdateAvatar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isLoading } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(user?.avatar || "");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const avatarFile = watch("avatar");

  // 🔹 Live preview
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [avatarFile]);

  const updateAvatarFn = async (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);

    try {
      const response = await dispatch(updateAvatar(formData)).unwrap();
      dispatch(updateUserAvatar(response.data.avatar));
      dispatch(fetchCurrentUser());
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({
        queryKey: ["subscribedChannels"],
        exact: false,
      });
      //queryClient.invalidateQueries({ queryKey: ["channel"] });

      toast.success("Avatar updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Failed to update avatar");
    }
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl bg-gray-300 rounded-2xl p-8 gap-8 border border-black/10">
        <div className="relative">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold mb-4">
            Change Profile Photo
          </h2>

          <form
            onSubmit={handleSubmit(updateAvatarFn)}
            className="space-y-4"
          >
            <Input
              type="file"
               className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100 cursor-pointer"
              accept="image/*"
              {...register("avatar", {
                required: "Please select an image",
              })}
            />

            {errors.avatar && (
              <p className="text-red-500 text-sm">
                {errors.avatar.message}
              </p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Save Avatar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAvatar;
