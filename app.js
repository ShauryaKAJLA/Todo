import express from 'express'
import cors from 'cors'
import { router as todoRoute } from './routes/todo.js';
import { router as authRoute } from './routes/auth.js';
import { router as profileRoute } from './routes/profile.js';
const app=express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use('/todo',todoRoute)
app.use('/LoginSignup',authRoute)
app.use('/profile',profileRoute)
export {app}