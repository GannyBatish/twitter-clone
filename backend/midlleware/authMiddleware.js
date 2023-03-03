const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');

const protect =asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=await jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id);
            next();
        }catch(error)
        {
            res.status(401);
            throw new Error("Error : Not authorized - Invalid Token");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized - No Token Found");
    }
})
module.exports=protect;