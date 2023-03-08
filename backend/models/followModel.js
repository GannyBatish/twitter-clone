const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    follow:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true,
})

module.exports=mongoose.model('Follow',userSchema);