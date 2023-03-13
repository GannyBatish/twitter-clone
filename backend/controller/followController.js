const asyncHandler = require("express-async-handler");
const Follow = require("../models/followModel");
const User = require("../models/userModel");

const follow=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    if(!user){
        res.status(401);
        throw new Error("Invalid Username. User doesn't Exist.");
    }
    if(user._id.toString()===req.user._id.toString()){
        res.status(401);
        throw new Error("You can't follow yourself");
    }
    var follow=await Follow.findOne({user:req.user._id,follow:user._id});
    if(follow){
        res.status(200);
        throw new Error(`You already following ${username}`);
    }
    follow=await Follow.create({user:req.user._id,follow:user._id});
    res.status(201).json({message:`You started following ${username}`});
})

const unfollow=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    var follow=await Follow.findOne({user:req.user._id,follow:user._id});
    if(follow){
        await follow.remove();
        return res.status(201).json({message:`Unfollows Successfully ${username}`});
    }
    res.status(401);
    throw new Error(`You never follows ${username}`);
})
const followers=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    var follower=await Follow.find({follow:user._id}).populate({
        path:'user',
        select:'name username bio pic -_id'
    }).sort('-createdAt');
    follower=follower.map((user)=>{
        return user.user;
    })
    res.status(201).json(follower);
})

const following=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    var followings=await Follow.find({user:user._id}).populate({
        path:'follow',
        select:'name username bio pic -_id',
    }).sort('-createdAt');
    followings=followings.map((user)=>{
        return user.follow;
    })
    res.status(201).json(followings);
})
module.exports={follow,unfollow,followers,following};