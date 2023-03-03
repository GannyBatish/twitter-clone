const asyncHandler=require('express-async-handler');
const joi=require('joi').extend(require('@joi/date'));
const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const genToken = require('../Token');

const userSchema=joi.object({
    name:joi.string().required().min(3),
    username:joi.string().required(),
    email:joi.string().email(),
    phone:joi.number().min(1000000000).max(9999999999),
    password:joi.string().required().min(8),
    dob:joi.date().required().format("YYYY/MM/DD").raw(),
}).or('email','phone');

const signup=asyncHandler(async(req,res)=>{
    const {name,username,email,password,dob,phone}=req.body;
    var {error}=await userSchema.validate({name,username,email,password,dob,phone});
    if(error){
        res.status(400);
        error=error.details[0].message.replace( /\"/g, "" );
        throw new Error(error);
    }
    const keyword={
        $or: [
            {
                $and:[
                    {email:{$eq:email}},
                    {email:{$ne:null}}
                ]
            },
            {
                $and:[
                    {username:{$eq:username}},
                    {username:{$ne:null}}
                ]
            },
            {
                $and:[
                    {phone:{$eq:phone}},
                    {phone:{$ne:null}}
                ]
            }
        ]
    }
    const userExist=await User.findOne(keyword)
    if(userExist){
        res.status(409)
        if(email!==undefined && userExist.email===email){
            throw new Error('Another account is using the same email.');
        }
        else if(username!==undefined && userExist.username===username){
            throw new Error("This username isn't available. Please try another.");
        }
        else{
            throw new Error('Another account is using the same Phone number');
        }
    }
    const user=await User.create({name,username,email,password,dob:new Date(dob),phone});
    const id=user._id;
        user=user._doc;
        //deleting unneccesary object properties
        delete user._id;delete user.password;delete user.createdAt;delete user.updatedAt;delete user.__v;delete user.isAdmin;
    res.status(201).json({
        ...user,
        token:await genToken(id),
    });
})



const loginSchema=joi.object({
    username:joi.string(),
    email:joi.string().email(),
    phone:joi.number().min(1000000000).max(9999999999),
    password:joi.string().required().min(8),
}).or("username","email","phone");
const login=asyncHandler(async(req,res)=>{
    const {email,phone,username,password}=req.body;
    var {error}=await loginSchema.validate({email,phone,username,password});
    if(error){
        res.status(400);
        error=error.details[0].message.replace( /\"/g, "" );
        throw new Error(error);
    }
    const keyword={
        $or: [
            {
                $and:[
                    {email:{$eq:email}},
                    {email:{$ne:null}}
                ]
            },
            {
                $and:[
                    {username:{$eq:username}},
                    {username:{$ne:null}}
                ]
            },
            {
                $and:[
                    {phone:{$eq:phone}},
                    {phone:{$ne:null}}
                ]
            }
        ]
    }
    var user=await User.findOne(keyword);
    if(user && await user.matchPassword(password)){
        const id=user._id;
        user=user._doc;
        //deleting unneccesary object properties
        delete user._id;delete user.password;delete user.createdAt;delete user.updatedAt;delete user.__v;delete user.isAdmin;
        res.status(200).json({
            ...user,
            token:await genToken(id),
        });
    }
    else{
        res.status(401)
        throw new Error('Invalid Username/Email/Phone Number or Password');
    }
})

module.exports={login,signup};