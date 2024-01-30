const express = require('express');

const { createUser, logIn, oneUser, getAll, logOut, favoritePost, removeFavorite } = require('../controllers/controller');
const {createPost, viewOne, viewAll, postUpdate, deletePost, comment, allComments, deleteComment, likes, sharePost, likePost} = require('../controllers/postController');
const { authenticate, admin } = require('../middleware/authenticate');

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', logIn);
router.post('/getOne/:id', oneUser);
//create a post
router.post('/posts', authenticate, createPost);
//view one post
router.get('/post/:postId', viewOne);
//view all post
router.get('/posts', viewAll);
//Favourite post
router.post("/favorite/:postId", authenticate, favoritePost)
//remove post From Favourite 
router.post("/removeFavorite/:postId", authenticate, removeFavorite)
//update a post
router.put('/update/:postId', authenticate, postUpdate);
//delete post
router.post('/delete/:postId', authenticate, deletePost);
//comment on a post
router.post('/comment/:postId', authenticate, comment);
//view all comment on a post
router.get('/comment/:postId', authenticate, allComments);
//delete comment on a post
router.delete('/deleteComment/:postId/:commentId', authenticate, deleteComment)
//Like a post
router.post('/Likes/:postId', authenticate, likePost);
//view like on a post
router.get('/viewLikes/:postId', authenticate, likes);
//share a post
router.post('/sharePost/:postId', authenticate, sharePost)


module.exports = router
