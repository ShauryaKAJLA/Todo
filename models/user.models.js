import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const  userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    avatar:{
        type:String,
        required:[true,"Avatar is required"],
    },
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    passwordLength:{
        type:Number,
        required:[true,"password Length is required"]
    },
    todo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Todo"
        }
    ]
})

userSchema.pre("save",async function (next){
    if(this.isModified("password"))
    this.password=await bcrypt.hash(this.password,12)
    next();
})
userSchema.methods.isPasswordCorrect=async function(password)
{
    return  await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)