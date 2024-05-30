import express from 'express'
import requireLoginMiddleware from '../middlewares/requireLogin.middleware.js'
import { User } from '../models/user.models.js'
import {Todo} from '../models/todo.models.js'
const router=express.Router()


router.post('/add',requireLoginMiddleware,(req,res)=>{
    const {data,user}=req.body.data
    User.findOne({email:user.email}).then(founded=>{
        if(!founded)
        {
            res.status(522).json({error:"User was not founded"})
        }
        else
        {
            
            const newTodo=new Todo({data:data,createdBy:user._id})
            newTodo.save().then(()=>{
                founded.todo.push(newTodo)
                founded.save().then(()=>{
                    res.status(202).json({message:"Todo was saved",todo:newTodo})
                }).catch((error)=>{
                    res.status(522).json({error:"Todo was not saved"})
                })
            }).catch((error)=>{
                res.status(522).json({error:"Todo was not saved"})
            })
            
        }
    })
})
router.post('/remove',requireLoginMiddleware,(req,res)=>{
    const {id,user}=req.body.data
    Todo.findOneAndDelete({_id:id}).then(()=>{
        User.findOne({email:user.email}).then(found=>{
            found.todo=found.todo.filter(item=>item._id!=id)
            found.save().then(()=>{
                res.status(200).json({message:"Todo was deleted"})
            }).catch(error=>{
                res.status(422).json({error:"Todo was not deleted"})
            })
        })
    }).catch(error=>{
        res.status(422).json({error:"Todo was not deleted"})
    })
})

router.post('/getAll',requireLoginMiddleware,async (req,res)=>{
    const {user} =req.body.data
    await Todo.find({createdBy:user._id}).then(result=>{
        res.status(200).json({todos:result})
    }).catch(error=>{
        console.log(error)
    })
})
export {router}