const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const tweetSchema=new Schema({
    author:{
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
    parentTweet:{
        type:mongoose.Types.ObjectId,
        ref:'Tweet',
        default:null,
    },
    isReply:{
        type:Boolean,
        default:false,
    },
    isRetweet:{
        type:Boolean,
        default:false,
    },
    retweets:[{
        type:mongoose.Types.ObjectId,
        ref:'Tweet'
    }],
    replies:[{
        type:mongoose.Types.ObjectId,
        ref:'Tweet'
    }],
    likes:[{
        type:mongoose.Types.ObjectId,
        ref:'TweetLike'
    }]
},{
    timestamps:true,
})


module.exports=mongoose.model('Tweet',tweetSchema);