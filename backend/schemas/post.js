const { Timestamp } = require('mongodb');
const {Int32} = require('mongoose')
const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const PostSchema = new Schema(
    {
    images:{
        type:Array,
        required:true,
    },
    likes:[{
        type: mongoose.Types.ObjectId,
        ref: "user",
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    caption:{
        type:String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    },
    {
        timestamps:true,
    }
);
module.exports = mongoose.model('post',PostSchema);