const express=require('express');
const { signup, login } = require('../controller/userController');
const protect = require('../midlleware/authMiddleware');
const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/hello',protect,(req,res)=>{
    res.send(req.user);
})
module.exports=router;