import {app} from './app.js'
import dotenv from 'dotenv'
import connectDb from './db/index.js'

dotenv.config({path:'./env'})

connectDb().then(()=>console.log("connected to mongo db")).catch((err)=>{
    console.log("Connection faild for mongo db: "+err);
})

app.listen(process.env.PORT||8000,()=>{
    console.log("Server is listening at port "+process.env.PORT);
})