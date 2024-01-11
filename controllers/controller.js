const {blogModel} = require("../Models/model");
const {validateBlog, validateLogin} = require("../helpers/validator");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();
// create a new student
const createUser = async (req, res) => {
  try {
    const {error} = await validateBlog(req.body);
    if(error){
        res.status(500).json({
            message: error.details[0].message,
        })
    }else {
        const {Username, email, password} = req.body
         const checkUser = await blogModel.findOne({email: email.toLowerCase()});
    if (checkUser) {
      res.status(400).json({
        message: "Registration successful",
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
    res.status(500).json({
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

// const createPost = async (req, res) => {
//     try {
//       const post = (await postModel.create(req.body)).populate("post");
//       res.json(post);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

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



  module.exports= {createUser, logIn, oneUser}