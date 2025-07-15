import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/claudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req,res)=>{
    // get user details from frontend
    // validation - not empty 
    // check if user alrady exists :- email,username
    // check for images and check for avatar
    // uplaod to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check for user creation 
    // return response 

    const {fullName , email , password , username} = req.body;
    console.log("email :" ,email)

    if([fullName,email,password,username].some((field)=> field?.trim() === ""))
    {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or : [{ username },{ email}]
    })

    if(existedUser)
    {
        throw new ApiError(409,"user with this email or username already exists")
    }

    console.log("requested files uploaded by multer :",req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath)
    {
        ApiError(400,"Avatar file is required ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)
    {
        ApiError(400,"Avatar file is required ")
    }

   const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url,
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
    {
        throw new ApiError(500,"something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
    
})

export {registerUser}