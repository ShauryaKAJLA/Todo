import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'
const connectDb=async ()=>{
    try
    {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Successfully connected to mongo db: "+connectionInstance.connection.host)
    }
    catch(error)
    {
        console.log("mongo db connection faild with error : "+error);
        process.exit();
    }
}
export default connectDb