import { User } from "../models/user.models.js";
import express from 'express'
const router=express.Router();

router.post('/',(req,res)=>{
    const {email,avatar,username,password}=req.body.data;
    if(!email||!avatar||!username||!password)
    {
        res.status(422).json({error:"Missing a value is not allowed",success:false})
    }
    else
    {
        User.findOne({email:email}).then((userExisted)=>{
            if(userExisted)
            {
                res.status(422).json({error:"User already exists with this email"})
            }
            else
            {
                    const user=new User({
                        email,
                        avatar,
                        username,
                        password,
                        passwordLength:password.length
                    })
                    user.save().then(()=>{
                        res.json({message:"User was created"})
                    }).catch((error)=>{
                        res.status(422).json({error:`User cannot be created due to : ${error}`})
                    })
            }
        })
    }

})

router.post('/login',(req,res)=>{
    const {data}=req.body
    if(!data.email||!data.password)
        {
            res.status(422).json({error:"All Fields are important"})
        }
    else
    {
        User.findOne({email:data.email}).then((userExisted)=>{
            if(!userExisted)
            {
                res.status(422).json({error:"User cannot be found with this email"}) 
            }
            else
            {
                userExisted.isPasswordCorrect(data.password).then(match=>{
                    console.log(match)
                    if(match)
                        {
                            let token=userExisted.generateAccessToken()
                            res.status(200).json({message:"User was logged in successfully",token})
                        }
                        else
                        {
                            res.status(422).json({error:"Password is incorrect"}) 
                        }
                })

            }
        })
    }
})
export {router}