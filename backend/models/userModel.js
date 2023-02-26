const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
        min:1000000000,
        max:9999999999,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
},{
    timestamps:true,
})