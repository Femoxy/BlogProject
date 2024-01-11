const {postModel} = require("../Models/model")

//const blogModel = require('../Models/model')

// const createPost=async(req,res)=>{
//     try {

//         const postOwner = await user.findById(req.params.id)
//         const {title, content} = req.body

//        const createpost= await new postModel({title, content})
       
//        //first method
//        postOwner.post.push(createpost);
//        createpost.save();
//        postOwner.save()

//       //second method
//        //createPost.link = postOwner
//        //await createPost.save()

//        res.status(200).json({
//         message: "post saved successfully",
//         //data:createPost,
//         FEMIEBEN: postOwner
//        })
        
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
        
//     }
// }


//create post
const createPost= async (req, res) => {
    try {
        const {title, content} = req.body;
      const post = new postModel({title, content});
      await post.save();
      res.json({message: 'Post created successfully', post});
    } catch (error) {
      res.status(500).json({ message: 'Error creating post'});
    }
  };

  // View single post
 const viewOne = async (req, res) => {
    try {
      const post = await postModel.findById(req.params.postId);
      res.json(post);

    } catch (error) {
      res.status(404).json({ error: 'Post not found' });
    }
  };
  
  //View all post
  const viewAll = async(req, res) =>{
    try {
        const posts = await postModel.find();
        res.json(posts);
        
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
  }

  //update a post
  const postUpdate = async (req, res)=>{
    try {
        const post = await postModel.findByIdAndUpdate(req.params.postId, req.body, {new: true});
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: 'Post not updated' });
    }
  }

  //delete post
  const deletePost = async (req, res)=>{
    try {
        const post = await postModel.findByIdAndDelete(req.params.postId);
        res.json({message: 'post deleted successfully'}, post)
        
    } catch (error) {
        
    }
  }

  //comment on a post
  const comment = async (req, res) =>{
    try {
        const {user, text} = req.body;
        const post = await postModel.findById(req.params.postId);
        if(post){
            post.comments.push({user, text});
            await post.save();
            res.json({message: 'comment is successfully added', post});
        } else {
            res.status(404).json({message: 'post not found'})
        }
  } catch (error) {
    res.status(404).json({ error: 'Error adding comment' });
  }
  };

  // View comments on a post
const allComments= async (req, res) => {
    try {
      const post = await postModel.findById(req.params.postId);
      if(post){
        res.json(post.comments);
      }else {
        res.status(404).json({message: 'post not found'})
      }
      
    } catch (error) {
      res.status(404).json({ error: 'Error retrieving comments' });
    }
  };
  
  // Delete comment on a post
const deleteComment= async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (post) {
      post.comments.id(req.params.commentId).remove();
      await post.save();
      res.json({ message: 'Comment deleted successfully', post });
    } else {
      res.status(404).json({ message: 'Error deleting comment' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View likes on a post
const likes = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (post) {
      res.json(post.likes);
    } else {
      res.status(404).json({ message: 'No likes yet'});
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving likes' });
  }
};

// Share a post
const sharePost =  async (req, res) => {
    try {
      const user = req.body.user;
      const post = await postModel.findById(req.params.postId);
      if (post) {
        post.likes.push(user);
        post.shares.push(user);
        await post.save();
        res.json({ message: 'Post shared successfully', post });
      } else {
        res.status(404).json({ message: 'Problem sharing post' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message});
  }
  };

module.exports = {createPost, viewOne, viewAll,
     postUpdate, deletePost, comment,
    allComments, deleteComment, likes, sharePost}


    