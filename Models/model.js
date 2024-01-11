const mongoose=require('mongoose');

const blogSchema = new mongoose.Schema({
    Username:{
        type: String,

    },
    email:{
        type: String
    },
    password: {
        type: String
    },

     post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "post"
    },

}, {timestamps: true})

const blogModel = mongoose.model("blog", blogSchema);

const postSchema = new mongoose.Schema({
    title:{
        type:String},
    content:{
        type:String},
    comments:[{
        user:String,
        text:String 
        }],
    likes:[{
        type: Number,
        default:0
    }],
        shares:[{type:Number,
        default:0
    }],

    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
}, {timestamps: true});

const postModel = mongoose.model('post', postSchema); 

module.exports = {blogModel, postModel}