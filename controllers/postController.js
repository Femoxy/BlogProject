const {blogModel,postModel} = require("../Models/model")


//create post
const createPost= async (req, res) => {
    try {
        const {title, content} = req.body;
        const postOwner = await blogModel.findById(req.user.userId)
      const post = new postModel({title:title, content:content});
      if(!post){
        return res.status(404).json('Post not found')
      }
      await post.save();
      postOwner.post.push(post)
      postOwner.save()
      res.json({message: 'Post created successfully', post});
    } catch (error) {
      res.status(500).json({ message:"internal server error "+ error.message});
    }
  };

  // View single post
 const viewOne = async (req, res) => {
    try {
      const post = await postModel.findById(req.params.postId);
      if(!post){
        return res.json({message: 'PostId Incorrect'})
      }
      res.json(post);

    } catch (error) {
      res.status(404).json({ error: 'Post not found' });
    }
  };
  
  //View all post
  const viewAll = async(req, res) =>{
    try {
        const posts = await postModel.find();
        if(posts.length===0){
            return res.status(404).json({message: 'No post found'})
          }
        res.status(200).json({
          message: `There are ${posts.length} posts in the database`,
          posts
        });
        
    } catch (error) {
        res.status(500).json( error.message );
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
        res.status(500).json(error.message)
    }
  }

  //comment on a post
  const comment = async (req, res) =>{
    try {
        const {user, text} = req.body;
        const post = await postModel.findById(req.params.postId);
        if(post){
            post.comments.push(req.body);
            await post.save();
            res.json({message: 'comment is successfully added', post});
        } else {
            return res.status(404).json({message: 'post not found'})
        }
  } catch (error) {
    return res.status(404).json({ error: 'Error adding comment' });
  }
  };

  //Like a post
//   const likePost = async (req, res) => {
//     try {
//         const Username = req.user.Username;
//         const post = await postModel.findById(req.params.postId);
//         if (!post) {
//             return res.status(404).json({
//                 message: "Post not found"
//             });
//         }
//         const indexOfUser = post.likeBy.indexOf(Username);
//         if (indexOfUser === -1) {
//             // If the user hasn't liked the post, add the like
//             post.likes += 1;
//             post.likeBy.push(Username);
//         } else {
//             // If the user has already liked the post, remove the like
//             post.likes -= 1;
//             post.likeBy.splice(indexOfUser, 1); // Remove the user from likeBy array
//         }
//         await post.save();
//         res.status(200).json({
//             message: "Like updated successfully",
//             likes: post.likes,
//             likeBy: post.likeBy
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Internal server error"+error.message
//         });
//     }
// };

        // Function to Like a Post
const likePost = async (req, res) => {
  try {
    const username = req.user.Username;
    const postId = req.params.postId;
    const post = await postModel.findById(postId);
    // Check if the user has already liked the post
    const userLiked = post.likeBy.indexOf(username);
    // userLiked will be -1 if not in the array
    if (userLiked === -1) {
      // User hasn't liked the post, so add like
      post.likeBy.push(username);
    
      post.likes += 1;
      await post.save(); 
      return res.status(200).json({
        message: 'Post liked successfully',
        likes: post.likes,
        likeBy: post.likeBy,
      });
    } else {
      // User has already liked the post, so remove like
      post.likeBy.splice(userLiked, 1);
      post.likes -= 1;
      await post.save();
      return res.status(200).json({
        message: 'Unliked',
        
      });
    } 

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

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
      res.status(500).json({ error: 'Error retrieving comments '+error.message });
    }
  };
  
  // Delete comment on a post
const deleteComment= async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (post) {
      //post.comments.id(req.params.commentId).remove();
      post.comments(req.params.commentId).remove();
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
      const user = req.user.Username;
      const postId= req.params.postId
      const post = await postModel.findById(postId);
      const indexOfUser = post.sharedBy.indexOf(user)
      if (indexOfUser ===-1) {  
        post.sharedBy.push(user);
        post.shares +=1
        await post.save();
        res.json({ message: 'Post shared successfully', 
        shares:post.shares,
        sharedBy: post.sharedBy });
      } else {
        post.sharedBy.splice(indexOfUser, 1)
        post.shares -=1
        await post.save()
        res.status(404).json({ message: 'Problem sharing post' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message});
  }
}

module.exports = {createPost, viewOne, viewAll,
     postUpdate, deletePost, comment,
    allComments, deleteComment, likePost, likes, sharePost
}

