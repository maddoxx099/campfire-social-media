const {Int32} = require('mongoose')
const { Timestamp } = require('mongodb');
const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const CommentSchema = new Schema(
    {
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
    },
    {
        timestamps:true,
    }
);
const com = mongoose.model('Comment',CommentSchema)
module.exports = com