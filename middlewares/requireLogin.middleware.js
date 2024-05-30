import jwt from "jsonwebtoken";

export default (req,res,next)=>{
    const {token}=req.body.data
    if(!token)
        {
            res.status(422).json({error:"Please provide a token or login"})
        }
    else
    {
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err)
                {
                    return res.status(422).json({error:"Invalid token"})
                }
                req.body.data.user=payload
        })
    }
    next()
}