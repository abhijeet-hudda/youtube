import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "../../componets/Input";
import Button from "../../componets/Button";

// thunks
import {
  updateAccountDetails,
  fetchCurrentUser,
} from "../../store/features/authFeatures/auth.Thunks";
import {
  updateUserAccount,
} from "../../store/features/authFeatures/auth.slice";

function UpdateAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isLoading, error } = useSelector((state) => state.auth);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
    },
  });

  // 🔹 keep form in sync with redux user
  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const updateFn = async (data) => {
    try {
      const response = await dispatch(
        updateAccountDetails(data)
      ).unwrap();
      dispatch(updateUserAccount(response.data));
      dispatch(fetchCurrentUser());
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
        exact: false,
      });
      //queryClient.invalidateQueries({ queryKey: ["channel"] });

      toast.success("Account updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Update failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-300 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold text-black">
          Update Account Details
        </h2>

        {error && (
          <p className="text-red-600 mt-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(updateFn)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full name"
              type="text"
              placeholder="Enter your full name"
              {...register("fullname", {
                required: "Full name is required",
              })}
              error={errors.fullname?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAccount;
