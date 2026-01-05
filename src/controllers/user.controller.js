import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/APIErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/APIResponse.js";
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //data base me save kro 
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false})

       return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went worng while generating access and refresh token")
    }

}

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
    //console.log("email: ", email);
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
    // console.log("req files is : ", req.files)
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
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

const loginUser = asyncHandler( async (req,res)=>{
    /* steps for loginuser
    1. req.body ->data le aao
    2. username or email base login
    3. find the user
    4. check password
    5. access and refresh token 
    6. send cookie
    */
    const {email,password,username} = req.body
    console.log(email)

    if(!username && !email){
        throw new ApiError(400, "username or password is required");
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user) throw new ApiError(404,"user does not exist");
    
    console.log("password:",password);

    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(isPasswordValid);

    if(!isPasswordValid) throw new ApiError(400,"Invaild user credentials")

    const {accessToken , refreshToken} = await generateRefreshAndAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }
    //response send 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged In Successfully"
        )
    )
   
})

const logoutUser = asyncHandler(async (req,res)=>{

    //yha user ka access nahi hota h to ek middleware add kiya
    //jo req me new field add (req.user) kr deta h 

    await User.findByIdAndUpdate(
        req.user._id,
        {
           $set: {   
                refreshToken : undefined  
                } 
        },
        {
            new: true
        }
    )
     const options = {
        httpOnly: true,
        secure: true
    }
     return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "user logged out"))

})

const refreshAccesssToken = asyncHandler(async(req,res)=>{

    /*
    1.cookies refresh token nikalo
    2.jwt verify 
    3.decodetoken lo bcz decodetoken._id se user mil jaye 
    4.refresh token to user refresh token se match kro 
    5. generate new token 
    6. send cookie
    */

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invaild refresh token ")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired ans used")
        }
        const {accessToken,newRefreshToken} = await generateRefreshAndAccessToken(user._id);
        const options = {
            httpOnly : true,
            secure: true
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken",newRefreshToken,option)
        .json(new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "Access Token refreshed"
        ))
    } catch (error) {
        throw new ApiError(401,error?.message||"Invaild refresh token")
    }

})
export {
    userRegister,
    loginUser,
    logoutUser,
    refreshAccesssToken
}