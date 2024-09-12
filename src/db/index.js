import mongoose from 'mongoose'
import { MONGODB_NAME } from '../constants.js'
export const connectDb=async ()=>{
    try
    {
        const mongoDbInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}`)
        console.log("Mongo Db connected : "+mongoDbInstance.connection.host)
    }
    catch(error)
    {
        console.log("Error while connecting to mongo db : "+error)
        process.exit()
    }
}

