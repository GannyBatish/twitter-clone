const express=require('express');
const { postTweet, reply, retweet, likeTweet, removeLikeTweet, deleteTweet, getTweet, getAllRepliesofTweet, tweetLikedBy, tweetRetweetedBy, quotedRetweetedBy } = require('../controller/tweetController');
const protect = require('../midlleware/authMiddleware');
const softProtect=require('../midlleware/softProtect');
const router=express.Router();

router.post('/',protect,postTweet);
router.get('/:id',softProtect,getTweet);
router.post('/:id/reply',protect,reply);
router.get('/:id/replies',softProtect,getAllRepliesofTweet);
router.get('/:id/likedby',protect,tweetLikedBy);
router.get('/:id/retweetedby',protect,tweetRetweetedBy);
router.get('/:id/quotedretweetedby',protect,quotedRetweetedBy);
router.post('/:id/retweet',protect,retweet);
router.post('/:id/like',protect,likeTweet);
router.delete('/:id/like',protect,removeLikeTweet);
router.delete('/:id',protect,deleteTweet);

module.exports=router;