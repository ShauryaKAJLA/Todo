import mongoose from 'mongoose'
import { User } from '../models/user.model.js'
import {asyncHandler} from '../utils/asyncHandler.util.js'
import { ApiResponse } from '../utils/ApiResponse.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { Todo } from '../models/todo.model.js'


const addTodo=asyncHandler(async (req,res)=>{
    const {data}=req.body
    if(data?.trim()==="")
    {
        res.status(400).json(new ApiError(400,"Data is required")) 
    }

    const newTodo=await Todo.create({
        data,createdBy:req.user?._id
    })

    if(!newTodo)
        {
            res.status(500).json(500,new ApiError("There was a problem while storing todo"))
        }
        return res.status(200).json(new ApiResponse(200,{_id:newTodo._id,data:newTodo.data},"Todo was saved successfully"))
})

const deleteTodo=asyncHandler(async (req,res)=>{
    const {todoID}=req.body
    if(!todoID)
    {
        res.status(400).json(new ApiError(400,"Todo id is not found")) 
    }
    const deleteTodo=await Todo.findByIdAndDelete(todoID)
    if(!deleteTodo)
        {
            res.status(500).json(new ApiError(500,"There was a problem while deleting the Todo")) 
        }
        res.status(200).json(new ApiResponse(200,{},"Todo was deleted"))
})

const getAllTodos=asyncHandler(async (req,res)=>{

    const Todos=await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id) 
            }
        },
        {
            $lookup:{
                from:"todos",
                localField:"_id",
                foreignField:"createdBy",
                as:"todos",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            data:1,
                        }
                    }
                ]
            }
        },
        {
            $project:{
                todos:1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,Todos[0].todos,"Todo returned successfully"))
})

export {getAllTodos,addTodo,deleteTodo}