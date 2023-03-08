const express=require('express');
const { follow, unfollow, followers, following } = require('../controller/followController');
const protect = require('../midlleware/authMiddleware');
const router=express.Router();

router.post('/follow/:username',protect,follow);
router.delete('/follow/:username',protect,unfollow);
router.get('/:username/followers',protect,followers);
router.get('/:username/following',protect,following);

module.exports=router;