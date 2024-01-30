const {blogModel, postModel} = require("../Models/model");
const {validateBlog, validateLogin} = require("../helpers/validator");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();
// create a new student
const createUser = async (req, res) => {
  try {
    const {error} = await validateBlog(req.body);
    if(error){
      return  res.status(500).json({
            message: error.details[0].message,
        })
    }else {
        const {Username, email, password} = req.body
         const checkUser = await blogModel.findOne({email: email.toLowerCase()});
    if (checkUser) {
    return  res.status(400).json({
        message: "User already exist",
      })
    } 
    const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt)
        
        const user = new blogModel({
           Username,
           email,
           password: hashPassword,
           
        })

        await user.save();
        res.status(201).json({
          message: "Registration successfull",
          data: user,
        });
        
    }
  } catch (error) {
   return res.status(500).json({
      message: error.message,
    });
  }
};
const logIn = async (req, res)=>{
    try {
        const {error} = await validateLogin(req.body);
        if(error){
            res.status(500).json({
                message: error.details[0].message,
            })
        } else{
            const {email, password} = req.body;

            //make sure all field are valid
            if(!email || !password){
                return res.status(400).json({
                    message: "Fields cannot be empty"
                })
            }
            //Find the user in the database
            const checkUser = await blogModel.findOne({ email: email.toLowerCase()})
    
            //check if the user is not existing and reutrn a response
            if(!checkUser){
                return res.status(404).json({
                    message: "User does not exist"
                })
            }
            //Verify the user's password
            const checkPassword = bcrypt.compareSync(password, checkUser.password);
            if(!checkPassword){
                return res.status(400).json({
                    message: "Password is incorrect"
                })
            }
            //const token = await jwt.sign({Username, email,}, process.env.secret, {expiresIn: '1d'})
    
            const token = jwt.sign({
                userId: checkUser._id,
                Username: checkUser.Username,
                email: checkUser.email
            }, process.env.secret, {expiresIn: '1d'})
            //Return a success response
            res.status(201).json({
                message: "Login successful",
                token: token
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

const oneUser = async(req, res)=>{
    try {
        const users = await blogModel.findById(req.params.id).populate("post");
    
        if(users){
          return res.status(200).json({
            message:"User exist",
            data: users
          })
        }
        
      } catch (error) {
        res.status(500).json({
          message: error.message
        })
        
      }
    }
 
    //Function to add post to favourite
    const favoritePost = async(req, res)=>{
      try {
        const postId = req.params.postId;
        const userId = req.user.userId;
        // Find the post by its ID
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json('Post not found');
        }
         // Find the user's blog
         const checkUser = await blogModel.findById(userId);
         if (!checkUser) {
             return res.status(404).json('User not found');
         }
         const isAlreadyFavorite = checkUser.favorite.includes(postId)
         if(isAlreadyFavorite){
          return res.status(400).json('Post is already in favorite')
         }
          // Add the post to the user's favorites
        checkUser.favorite.push(postId);
        await checkUser.save();
        return res.status(200).json({message: 'Post added to favourite successfully', checkUser})
        
      } catch (error) {
        return res.status(500).json(error.message)
        
      }
    }
   
    const removeFavorite = async(req, res)=>{
      try {
        const postId = req.params.postId
        const userId = req.user.userId
//Find the post ID
const post = await postModel.findById(postId)
if(!post){
  return res.status(400).json('Post not Found')
}
//Find the user
const checkUser = await blogModel.findById(userId)
if(!checkUser){
  return res.status(404).json('User not Found')
}
 // Check if the post is in the user's favorites
 const postIndex = checkUser.favorite.indexOf(postId);
 if (postIndex === -1) {
     return res.status(400).json('Post is not in favorites');
 }else{
       // Remove the post from the user's favorites
 checkUser.favorite.splice(postIndex, 1);
 await checkUser.save();
 return res.status(200).json({message: 'Post removed from favorites successfully', checkUser})

 }

      } catch (error) {
        return res.status(500).json({error: error.message})
        
      }
    }

  module.exports= {createUser, logIn, oneUser, favoritePost, removeFavorite}