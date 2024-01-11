const express = require('express');

const { createUser, logIn, oneUser, getAll, logOut } = require('../controllers/controller');
const {createPost, viewOne, viewAll, postUpdate, deletePost, comment, allComments, deleteComment, likes, sharePost} = require('../controllers/postController');
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
//update a post
router.put('/update/:postId', postUpdate);
//delete post
router.post('/delete/:postId', deletePost);
//comment on a post
router.post('/comment/:postId', comment);
//view all comment on a post
router.get('/comment/:postId', allComments);
//delete comment on a post
router.delete('/deleteComment/:postId/:commentId', deleteComment)
//view like on a post
router.get('/viewLikes/:postId', likes);
//share a post
router.post('/sharePost/:postId', sharePost)


module.exports = router
