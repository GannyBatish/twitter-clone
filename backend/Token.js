const jwt = require("jsonwebtoken")

module.exports=async(id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET)
}