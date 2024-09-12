import app from "./app.js";
import dotenv from 'dotenv'
import { connectDb } from "./db/index.js";


dotenv.config({path:".env"})
connectDb().then(()=>{
    console.log("Mongo db Server is connected")
}).catch(()=>{
    console.log("Mongo db server is not connected")
})

app.listen(process.env.PORT,()=>{
    console.log("Server is listening at port: "+process.env.PORT)
})