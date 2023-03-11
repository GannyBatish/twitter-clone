const express=require('express');
const { postTweet, reply, retweet, likeTweet, removeLikeTweet, deleteTweet } = require('../controller/tweetController');
const protect = require('../midlleware/authMiddleware');
const router=express.Router();

router.post('/',protect,postTweet);
router.post('/:id/reply',protect,reply);
router.post('/:id/retweet',protect,retweet);
router.post('/:id/like',protect,likeTweet);
router.delete('/:id/like',protect,removeLikeTweet);
router.delete('/:id',protect,deleteTweet);
module.exports=router;