import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    data:{
        type:String,
        required:[true,"Data is required"],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

export const Todo=mongoose.model("Todo",todoSchema)