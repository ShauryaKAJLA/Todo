import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary=async (path)=>{
    try
    {
        if(!path)
        {
            return null
        }
        const result=await cloudinary.uploader.upload(path)
        fs.unlink(path)
        return result
    }
    catch(error)
    {
        fs.unlink(path)
        return null;
    }
}

export default uploadToCloudinary