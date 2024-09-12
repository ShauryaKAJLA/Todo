import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from 'jsonwebtoken'
import uploadToCloudinary from "../utils/cloudinary.util.js";

const generateAccessAndRefreshToken=async (user)=>{
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({validationBeforeSave:false})
    return {accessToken,refreshToken}
}
const registerUser=asyncHandler(async(req,res)=>{

    const {username,email,password,avatar}=req.body

    if([username,email,password,avatar].some(fields=>fields?.trim()===""))
    {
       return res.status(400).json(new ApiError(400,"All fields are required")) 
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser)
    {
        return res.status(400).json(new ApiError(400,"User already exists with this email or Username")) 
    }

    const createUser=await User.create({
        username,email,password,avatar,passwordSize:password?.length
    })
    if(!createUser)
        {
            return res.status(500).json(new ApiError(500,"There was problem while creating thge user"))
        }
    const user=await User.findById(createUser._id).select("-password -refreshToken")

    if(!user)
        {
            res.status(500).json(new ApiError(500,"There was problem while creating thge user") )            
        }
        return res.status(200).json(new ApiResponse(200,user,"User is created Successfully"))
})
const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    if((email?.trim()==="" )&&(password?.trim()===""))
    {
       return res.status(400).json(new ApiError(400,"email  and password is required to Login")) 
    }

    const existsUser=await User.findOne({email})
    if(!existsUser)
    {
        return res.status(400).json(new ApiError(400,"No user was founded with this email")) 
    }
    const correctPassword=await existsUser.isPasswordCorrect(password)

    if(!correctPassword)
    {
        return res.status(400).json(new ApiError(400,"Password is incorrect")) 
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(existsUser)

    const user=await User.findById(existsUser._id).select("-password -refreshToken")

    return res.status(200).cookie("accessToken",accessToken,{expires:new Date(Date.now()+86400000),httpOnly:true,secure:true}).cookie("refreshToken",refreshToken,{expires:new Date(Date.now()+(86400000*10)),httpOnly:true,secure:true}).json(new ApiResponse(200,{user,accessToken,refreshToken},"User was logged in successfully"))

})
const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user?._id,{
        $unset: {
            refreshToken: 1 // this removes the field from document
        }
    },
    {
        new:true
    }
)
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200,{},"User was logged Out"))

})
const refreshAccessToken=asyncHandler(async (req,res)=>{
    const inRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken
    if(!inRefreshToken)
    {
       return res.status(400).json(new ApiError(400,"Refresh Token Not found")) 
    }
    const decodedToken= jwt.verify(inRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken)
    {
       return res.status(400).json(new ApiError(400,"Unauthorized Token")) 
    }
    const userToRefresh=await User.findById(decodedToken._id)

    if(!userToRefresh)
        {
           return res.status(400).json(new ApiError(400,"No user exists with this Token")) 
        }

        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(userToRefresh)
        const user=await User.findById(userToRefresh._id).select("-password -refreshToken")

        return res.status(200).cookie("accessToken",accessToken,{expires:new Date(Date.now()+86400000),httpOnly:true,secure:true}).cookie("refreshToken",refreshToken,{expires:new Date(Date.now()+(86400000*10)),httpOnly:true,secure:true}).json(new ApiResponse(200,user,"User access Token was refreshed"))
})
const getCurrentUser=asyncHandler(async (req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current user fetched successfully"))
})



export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser}

