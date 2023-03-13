const asyncHandler = require("express-async-handler");
const {upload}=require('../util/cloudinary');
const Tweet=require('../models/tweetModel');
const Like = require("../models/TweetLikeModel");
const { populate } = require("../models/userModel");
const Follow = require("../models/followModel");


const postTweet=asyncHandler(async(req,res)=>{
    const {tweet}=req.body;
    var pic;
    if(req.files){
        const result=await upload(req.files.pic.tempFilePath);
        if(result.message==='fail'){
            res.status(401);
            throw new Error('Failed to Upload Image. PLease try again later.')
        }
        pic=result.url;
    }
    var t=await Tweet.create({author:req.user._id,tweet,pic});
    t=await Tweet.findById(t._id).populate({
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    t=t._doc;t.replies=0;t.retweets=0;t.likes=0;t.isLikedByMe=false;t.isRetweetedByMe=false;
    res.status(201).json(t);
})






const reply=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {tweet}=req.body;
    const t=await Tweet.findById(id);
    if(!t)
    {
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    var pic;
    if(req.files){
        const result=await upload(req.files.pic.tempFilePath);
        if(result.message==='fail'){
            res.status(401);
            throw new Error('Failed to Upload Image. PLease try again later.')
        }
        pic=result.url;
    }
    var reply=await Tweet.create({
        author:req.user._id,
        isReply:true,
        tweet,
        pic,
        parentTweet:t._id,
    })
    t.replies.push(reply._id);
    await t.save();
    reply=await Tweet.findById(reply._id).populate([{
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    },{
        path:'parentTweet',
        populate: [{
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },{
            path:'likes',
            select:'user -_id',
            populate:{
                path:'user',
                select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
            }
        },{
            path:'retweets',
            select:'author -_id',
        }],
    }])
    //adding the required field and removing some unrequired fields
    var result=reply._doc;result.isLikedByMe=false;result.isRetweetedByMe=false;
    if(result.parentTweet !== null){
        var parentTweet=result.parentTweet._doc;parentTweet.isRetweetedByMe=parentTweet.retweets.some((user)=>user.author.toString()===req.user._id.toString());parentTweet.replies=parentTweet.replies.length;parentTweet.retweets=parentTweet.retweets.length;parentTweet.isLikedByMe=parentTweet.likes.some((user)=>user.user.toString()===req.user._id.toString());parentTweet.likes=parentTweet.likes.length;
        result.parentTweet=parentTweet;
    }
    result.replies=result.replies.length;result.retweets=result.retweets.length;result.likes=result.likes.length;
    res.status(201).json(result);
})




const retweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {tweet}=req.body;
    const t=await Tweet.findById(id);
    if(!t)
    {
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    var pic;
    if(req.files){
        const result=await upload(req.files.pic.tempFilePath);
        if(result.message==='fail'){
            res.status(401);
            throw new Error('Failed to Upload Image. PLease try again later.')
        }
        pic=result.url;
    }
    var retweet=await Tweet.create({
        author:req.user._id,
        isRetweet:true,
        tweet,
        pic,
        parentTweet:t._id,
    })
    t.retweets.push(retweet._id);
    await t.save();
    retweet=await Tweet.findById(retweet._id).populate([{
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    },{
        path:'parentTweet',
        populate: [{
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },{
            path:'likes',
            select:'user -_id',
            populate:{
                path:'user',
                select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
            }
        },{
            path:'retweets',
            select:'author -_id',
        }],
    }])
    //adding the required field and removing some unrequired fields
    var result=retweet._doc;result.isLikedByMe=false;result.isRetweetedByMe=false;
    if(result.parentTweet !== null){
        var parentTweet=result.parentTweet._doc;parentTweet.isRetweetedByMe=true;parentTweet.replies=parentTweet.replies.length;parentTweet.retweets=parentTweet.retweets.length;parentTweet.isLikedByMe=parentTweet.likes.some((user)=>user.user.toString()===req.user._id.toString());parentTweet.likes=parentTweet.likes.length;
        result.parentTweet=parentTweet;
    }
    result.replies=result.replies.length;result.retweets=result.retweets.length;result.likes=result.likes.length;

    res.status(201).json(result);
});




const likeTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const tweet=await Tweet.findById(id);
    if(!tweet)
    {
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    const existLike=await Like.findOne({user:req.user._id,tweet:tweet._id});
    if(existLike){
        res.status(401);
        throw new Error('You have already Liked the Tweet');
    }
    const like=await Like.create({user:req.user._id,tweet:tweet._id});
    tweet.likes.push(like._id);
    await tweet.save();
    res.status(201).json({message:'Liked Tweet Successfully'});
})




const removeLikeTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const tweet=await Tweet.findById(id);
    if(!tweet)
    {
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    const like=await Like.findOne({user:req.user._id,tweet:tweet._id});
    if(!like){
        res.status(401);
        throw new Error("You Never Liked this Tweet before");
    }
    await like.remove();
    tweet.likes.pull(like._id);
    await tweet.save();
    res.status(201).json({message:'Unlike Tweet Sucessfully'});
})





const deleteTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const tweet=await Tweet.findById(id);
    if(!tweet){
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    if(tweet.author.toString()===req.user._id.toString() || req.user.isAdmin){
        if(tweet.isReply){
            const parentTweet=await Tweet.findById(tweet.parentTweet);
            parentTweet.replies.pull(tweet._id);
            await parentTweet.save();
        }
        if(tweet.isRetweet){
            const parentTweet=await Tweet.findById(tweet.parentTweet);
            parentTweet.retweets.pull(tweet._id);
            await parentTweet.save();
        }
        await tweet.remove();
        return res.status(202).json({message:'Successfully deleted Tweet'});
    }
    res.status(401);
    throw new Error('You are not authorized to delete this Tweet');
})




const getTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    var result=await Tweet.findById(id).populate([{
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    },{
        path:'parentTweet',
        populate: [{
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },{
            path:'likes',
            select:'user -_id',
        },{
            path:'retweets',
            select:'author -_id',
        }],
    },{
        path:'likes',
        select:'user -_id',
    },{
        path:'retweets',
        select:'author -_id',
    }])
    if(!result){
        res.status(404);
        throw new Error('Invalid Tweet Id');
    }
    //adding the required field and removing some unrequired field
    result=result._doc;
    if(req.user!==null){result.isLikedByMe=result.likes.some((user)=>user.user.toString()===req.user._id.toString());result.isRetweetedByMe=result.retweets.some((user)=>user.author.toString()===req.user._id.toString())}
    if(result.parentTweet !== null){
        var parentTweet=result.parentTweet._doc;
        if(req.user!==null) { parentTweet.isLikedByMe=parentTweet.likes.some((user)=>user.user.toString()===req.user._id.toString());parentTweet.isRetweetedByMe=parentTweet.retweets.some((user)=>user.author.toString()===req.user._id.toString())}
        parentTweet.replies=parentTweet.replies.length;parentTweet.retweets=parentTweet.retweets.length;parentTweet.likes=parentTweet.likes.length;
        result.parentTweet=parentTweet;
    }
    result.replies=result.replies.length;result.retweets=result.retweets.length;result.likes=result.likes.length;
    res.status(201).json(result);
})
const getAllRepliesofTweet=asyncHandler(async(req,res)=>{
    const page = req.query.page || 1;
    const perPage = 25;
    const {id}=req.params;
    const tweet=await Tweet.findById(id).populate({
        path:'replies',
        options:{
            sort: { createdAt: -1 },
            skip: (page - 1) * perPage,
            limit: perPage,
            populate: [{
                path: 'author',
                select: '-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob',
            },{
                path:'likes',
                select:'user -_id'
            },{
                path:'retweets',
                select:'author -_id'
            }],
        },
    })
    if(!tweet){
        res.status(404);
        throw new Error("Invalid Tweet ID");
    }
    const obj=[];
    tweet.replies.forEach((reply)=>{
        const result=reply._doc;
        if(req.user!==null) { result.isLikedByMe=result.likes.some((user)=>user.user.toString()===req.user._id.toString());result.isRetweetedByMe=result.retweets.some((user)=>user.author.toString()===req.user._id.toString());}
        result.replies=result.replies.length;result.retweets=result.retweets.length;result.likes=result.likes.length;
        obj.push(result);
    })
    res.json(obj);
});




const tweetLikedBy=asyncHandler(async(req,res)=>{
    const page = req.query.page || 1;
    const perPage = 25;
    const {id}=req.params;
    const tweet=await Tweet.findById(id).populate({
        path:'likes',
        select:'user -_id',
        options:{
            sort: { createdAt: -1 },
            skip: (page - 1) * perPage,
            limit: perPage,
            populate:{
                path:'user',
                select:'name username pic bio'
            }
        },
    })
    if(!tweet){
        res.status(404);
        throw new Error("Invalid Tweet ID");
    }
    const users=tweet.likes.map((user)=> user.user._id);
    var followers=await Follow.find({
        $and:[
            {user:req.user._id,},
            {follow:{$in:users}}
        ]
    })
    followers=followers.map((user)=>user.follow);
    const result=tweet.likes.map((user)=>{
        const obj=user.user._doc;
        if(obj._id.toString()!==req.user._id.toString())    {obj.isFollowedByMe=followers.some((u)=>u.toString()===obj._id.toString())}
        delete obj._id;return obj;
    })
    res.status(200).json(result);
})


const tweetRetweetedBy=asyncHandler(async(req,res)=>{
    const page = req.query.page || 1;
    const perPage = 25;
    const {id}=req.params;
    const tweet=await Tweet.findById(id).populate({
        path:'retweets',
        select:'author -_id',
        match:{tweet:{$eq:null}},
        options:{
            sort: { createdAt: -1 },
            skip: (page - 1) * perPage,
            limit: perPage,
            populate:{
                path:'author',
                select:'name username pic bio'
            }
        },
    })
    if(!tweet){
        res.status(404);
        throw new Error("Invalid Tweet ID");
    }
    const users=tweet.retweets.map((user)=> user.author._id);
    var followers=await Follow.find({
        $and:[
            {user:req.user._id,},
            {follow:{$in:users}}
        ]
    })
    followers=followers.map((user)=>user.follow);
    const result=tweet.retweets.map((user)=>{
        const obj=user.author._doc;
        if(obj._id.toString()!==req.user._id.toString())    {obj.isFollowedByMe=followers.some((u)=>u.toString()===obj._id.toString())}
        delete obj._id;return obj;
    })
    res.status(200).json(result);
})

const quotedRetweetedBy=asyncHandler(async(req,res)=>{
    const page = req.query.page || 1;
    const perPage = 25;
    const {id}=req.params;
    const tweet=await Tweet.findById(id).populate({
        path:'retweets',
        match:{tweet:{$ne:null}},
        options:{
            sort: { createdAt: -1 },
            skip: (page - 1) * perPage,
            limit: perPage,
            populate:[{
                path:'author',
                select:'name username pic -_id'
            },{
                path:'parentTweet',
                select:'-retweets -likes -replies',
                populate:{
                    path:'author',
                    select:'name username pic -_id'
                }
            },{
                path:'likes',
                select:'user -_id'
            },{
                path:'retweets',
                select:'author -_id'
            }]
        },
    })
    if(!tweet){
        res.status(404);
        throw new Error("Invalid Tweet ID");
    }
    // return res.json(tweet.retweets);
    const obj=tweet.retweets.map((t)=>{
        var result=t._doc;result.isLikedByMe=result.likes.some((user)=>user.user.toString()===req.user._id.toString());result.isRetweetedByMe=result.retweets.some((user)=>user.author.toString()===req.user._id.toString())
        result.replies=result.replies.length;result.retweets=result.retweets.length;result.likes=result.likes.length;
        return result;
    })
    res.status(200).json(obj);
})

module.exports={
    postTweet,
    reply,
    retweet,
    likeTweet,
    removeLikeTweet,
    deleteTweet,
    getTweet,
    getAllRepliesofTweet,
    tweetLikedBy,
    tweetRetweetedBy,
    quotedRetweetedBy
};