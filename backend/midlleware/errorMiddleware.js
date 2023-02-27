const notFound=(req,res)=>{
    res.status(404).json({
        message:`Error : Not Found ${req.method} -> ${req.originalUrl}`
    })
}

const errorHandler=(err,req,res,next)=>{
    res.json({
        message:err.message,
    });
}

module.exports={notFound,errorHandler};