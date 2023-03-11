const asyncHandler = require("express-async-handler");
const {upload}=require('../util/cloudinary');
const Tweet=require('../models/tweetModel');
const Like = require("../models/TweetLikeModel");
const postTweet=asyncHandler(async(req,res)=>{
    const {tweet}=req.body;
    var pic;
    if(req.files){
        const result=await upload(req.files.pic.tempFilePath);
        pic=result.url;
    }
    var t=await Tweet.create({author:req.user._id,tweet,pic});
    t=await Tweet.findById(t._id).populate({
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
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
    reply=await Tweet.findById(reply._id).populate({
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    }).populate({
        path:'parentTweet',
        populate: {
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },
        populate:{
            path:'likes',
            select:'user createdAt',
            populate:{
                path:'user',
                select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
            }
        }
    });
    res.status(201).json(reply);
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
    retweet=await Tweet.findById(retweet._id).populate({
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    }).populate({
        path:'parentTweet',
        populate: {
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },
        populate:{
            path:'likes',
            select:'user createdAt',
            populate:{
                path:'user',
                select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
            }
        }
    })

    res.status(201).json(retweet);
})
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
    const result=await Tweet.findById(tweet._id).populate({
        path:'author',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    }).populate({
        path:'parentTweet',
        populate: {
            path: 'author',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        },
        populate:{
            path:'likes',
            select:'user createdAt',
            populate:{
                path:'user',
                select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
            }
        }
    }).populate({
        path:'likes',
        select:'user createdAt',
        populate:{
            path:'user',
            select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
        }
    })
    res.status(201).json(result);
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
    res.status(201).json({message:'Successfully removed Like'});
})
const deleteTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const tweet=await Tweet.findById(id);
    if(!tweet){
        res.status(404);
        throw new Error('No Tweet Found with given ID');
    }
    if(tweet.author.toString()===req.user._id.toString() || req.user.isAdmin){
        await tweet.remove();
        return res.status(202).json({message:'Successfully deleted Tweet'});
    }
    res.status(401);
    throw new Error('You are not authorized to delete this Tweet');
})
module.exports={postTweet,reply,retweet,likeTweet,removeLikeTweet,deleteTweet};