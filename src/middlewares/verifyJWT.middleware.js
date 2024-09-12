import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { User } from '../models/user.model.js'


export const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        
        const token=req.cookies?.accessToken || req.body.accessToken
        if(!token)
        {
            return res.status(400).json( new ApiError(400,"Unauthorized access"))
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        if(!decodedToken)
        {
                return res.status(400).json( new ApiError(400,"Unauthorized access"))
        }
        const user=await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!user)
            {
                return res.status(400).json( new ApiError(400,"Invalid access token"))
            }
        req.user=user
        next()
    } catch (error) {
        res.status(400).json( new ApiError(400,error.message||"Invalid access token"))
    }
})

