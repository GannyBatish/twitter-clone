const asyncHandler=require('express-async-handler');
const login=async(req,res)=>{

}


const signup=asyncHandler(async(req,res)=>{
    res.status(401);
    throw new Error('Hello');
})

module.exports={login,signup};