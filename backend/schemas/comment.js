const {Int32} = require('mongoose')
const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const CommentSchema = new Schema({
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
const com = mongoose.model('Comment',CommentSchema)
module.exports = com