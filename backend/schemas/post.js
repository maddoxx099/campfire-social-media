const {Int32} = require('mongoose')
const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const PostSchema = new Schema({
    likes:{
        type:Number,
        required:true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    caption:{
        type:String,
        required:true
    }
})