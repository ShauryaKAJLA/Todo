import express from 'express'
import requireLoginMiddleware from '../middlewares/requireLogin.middleware.js'
import { User } from '../models/user.models.js'
const router=express.Router()

router.post('/',requireLoginMiddleware,(req,res)=>{
    const {user} =req.body.data
    User.findOne({email:user.email}).then(founded=>{
        if(!founded)
            {
                res.status(522).json({error:"User not founded"})
            }
            else
            {
                res.status(200).json(founded)
            }
    }).catch(error=>{
        res.status(522).json({error:error})
    }
    )
})



export {router}