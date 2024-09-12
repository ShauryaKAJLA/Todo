import mongoose from 'mongoose'


const todoSchema=new mongoose.Schema({
        data:{
            type:String,
            required:true
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
})


export const Todo =mongoose.model("Todo",todoSchema)
