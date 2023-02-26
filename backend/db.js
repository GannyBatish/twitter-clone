const mongoose = require("mongoose")

module.exports=async()=>{
    try{
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.DBURI);
        console.log('Connected To MongoDb');
    }catch(error){
        console.log(error);
        process.exit();
    }
}