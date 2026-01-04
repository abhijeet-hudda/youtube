import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/APIErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/APIResponse.js";

const userRegister = asyncHandler(async (req, res)=>{
    /*  steps for user register 
        1.get user detail from frontend (wo detail jo user.model me h)
        2.validation- not empty...
        3.check if user alredy exists : username, email
        4.check for image,check for avatar
        5.upload them to cloudinary, avatar
        6.create user object - create entry in db
        7.remove password and refresh token field from response
        8.check for user creation 
        9.return response(res)
    */
   
    const {fullname, email, username, password} =req.body
    // console.log("email: ", email);
    // console.log("req body : ",req.body)
    //data handle ho gya is ke baad file handle karni h wo multer se hogi route me
    //validation
    if(
        [fullname,email, username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    // middlewares req ke ander or fields add karta h 
    const avatarLocalPath = req.files?.avatar[0]?.path;
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log("req files is : ", req.files)
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)  throw new ApiError(400,"Avatar file is required");

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url||"",
        email,
        password,
        username: username.toLowerCase()
    })
    //mongodb har entry pe _id create krta h automatically
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "something went worng while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


})

export {userRegister}