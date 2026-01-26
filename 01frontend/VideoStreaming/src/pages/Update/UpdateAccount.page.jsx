import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Input from "../../componets/Input";
import Button from "../../componets/Button";
import { updateAccountDetails } from "../../store/features/authFeatures/auth.Thunks";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UpdateAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 1. Get current user data to pre-fill the form
  const { isLoading, error, userData } = useSelector((state) => state.auth);

  const {
    handleSubmit,
    register,
    setValue, // Used to set initial values
    formState: { errors },
  } = useForm({
     // Optional: Set default values here if userData is available immediately
     defaultValues: {
        fullname: userData?.fullname || "",
        email: userData?.email || ""
     }
  });

  useEffect(() => {
    if (userData) {
      setValue("fullname", userData.fullname);
      setValue("email", userData.email);
    }
  }, [userData, setValue]);

  const updateFn = async (data) => {
    try {
      await dispatch(updateAccountDetails(data)).unwrap();
      toast.success("Account updated successfully!");
      navigate("/")
    } catch (err) {
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className={`mx-auto w-full max-w-lg bg-gray-300 rounded-xl p-10  border border-black/10`}
      >
        <h2 className="text-center text-2xl font-bold leading-tight text-black">
          Update Account Details
        </h2>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(updateFn)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Fullname: "
              type="text"
              placeholder="Enter your fullname"
              {...register("fullname", {
                required: true,
              })}
              error={errors.fullname?.message}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
              error={errors.email?.message}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating in..." : "Update Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAccount
