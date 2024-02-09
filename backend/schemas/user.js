const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const UserSchema = new Schema({
    name:{
        required:true,
        type:String

    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
  });
  const User = mongoose.model('user',UserSchema)
  module.exports = User