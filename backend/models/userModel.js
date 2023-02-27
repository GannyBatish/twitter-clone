const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require('bcrypt');

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
    dob:{
        type:Date,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
},{
    timestamps:true,
})

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
userSchema.methods.matchPassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model('User',userSchema);