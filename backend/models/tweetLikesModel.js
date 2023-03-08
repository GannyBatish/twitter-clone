const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const tweetLikesSchema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    tweet:{
        type:mongoose.Types.ObjectId,
        ref:'Tweet',
        required:true,
    },
},{
    timestamps:true,
})

module.exports=mongoose.model('TweetLikes',tweetLikesSchema);
