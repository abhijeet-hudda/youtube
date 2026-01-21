import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {useForm} from "react-hook-form"
import Button from "./Button"
import Input from "./Input"
import { registerUser } from "../store/features/authFeatures/auth.Thunks";
import { clearAuthError } from "../store/features/authFeatures/auth.slice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur", 
  });

  useEffect(() => {
    // If user is successfully registered/logged in, redirect to home
    if (isAuthenticated) {
      navigate("/");
    }

    // Cleanup: Clear any auth errors when component unmounts
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSignupSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-8">
      <div className="mx-auto w-full max-w-lg bg-gray-300 rounded-xl p-10 border border-black/10 shadow-sm">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-100px">
            Logo
          </span>
        </div>
        
        <h2 className="text-center text-2xl font-bold leading-tight text-black/60">
          Sign up to create account
        </h2>
        
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8 text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSignupSubmit)} className="mt-8">
          <div className="space-y-5">
            <div>
              <Input
                label="Full Name: "
                placeholder="Enter your full name"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.name?.message}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input
                label="Username: "
                type="username"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 6,
                    message: "Username must be at least 6 characters",
                  },
                })}
                error={errors.username?.message}
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email address must be a valid address",
                  },
                })}
                error={errors.email?.message}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Input
                label="Avatar: "
                type="file"
                placeholder="Enter your avatar"
                {...register("avatar", {
                  required: "Avatar is required",
                  minLength: {
                    value: 6,
                    message: "Avatar must be at least 6 characters",
                  },
                })}
                error={errors.avatar?.message}
              />
              {errors.avatar && <p className="text-red-600 text-sm mt-1">{errors.avatar.message}</p>}
            </div>
            <div>
              <Input
                label="CoverImage: "
                type="file"
                placeholder="Enter your cover image"
                {...register("coverImage", {
                  required: "CoverImage is required",
                  minLength: {
                    value: 6,
                    message: "CoverImage must be at least 6 characters",
                  },
                })}
                error={errors.coverImage?.message}
              />
              {errors.coverImage && <p className="text-red-600 text-sm mt-1">{errors.coverImage.message}</p>}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;