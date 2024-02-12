const { Int32 } = require("mongodb");
const { default: mongoose } = require("mongoose");

const{Schema}=mongoose

const UserSchema = new Schema({
    name:{
        required:true,
        type:String,
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    nametag:{
        required:true,
        type:Number
    },
    avatar:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },
    followers: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
    ],
      following:[
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
    ]
  });
  const User = mongoose.model('user',UserSchema)
  module.exports = User