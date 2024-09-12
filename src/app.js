import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express()


app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true

}))
app.use(cookieParser())

import userRoute from '../src/routes/user.route.js'
import todoRoute from '../src/routes/todo.route.js'
app.use("/users/",userRoute)
app.use("/todo",todoRoute)
export default app