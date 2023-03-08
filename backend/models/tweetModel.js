const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const tweetSchema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    tweet:{
        type:String,
    },
    pic:{
        type:String,
    },
},{
    timestamps:true,
})


module.exports=mongoose.model('Tweet',tweetSchema);