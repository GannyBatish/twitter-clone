const asyncHandler = require("express-async-handler");
const Follow = require("../models/followModel");
const User = require("../models/userModel");

const follow=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    var follow=await Follow.findOne({user:req.user._id,follow:user._id}).populate({
        path:'user follow',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    if(follow){
        return res.status(201).json(follow);
    }
    follow=await Follow.create({user:req.user._id,follow:user._id});
    follow=await Follow.findById(follow._id).populate({
        path:'user follow',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    res.status(201).json(follow);
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
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
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
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    followings=followings.map((user)=>{
        return user.follow;
    })
    res.status(201).json(followings);
})
module.exports={follow,unfollow,followers,following};