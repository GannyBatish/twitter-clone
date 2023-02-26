const notFound=(req,res,next)=>{
    res.status(404).json({
        message:`Error : Not Found ${req.originalUrl}`
    })
    next(error);
}

const errorHandler=(err,req,res,next)=>{
    res.json({
        message:err.message,
    });
}

module.exports={notFound,errorHandler};