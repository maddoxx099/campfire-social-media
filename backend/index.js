//mongo setup
const mongoose = require("mongoose");
const express = require("express");
//const dotenv = require("dotenv");
const app = express();
const cors = require('cors');
app.use(cors());


//require("dotenv").config();
const url = "mongodb+srv://maddoxx099:gamingid78@ishmit1.qruysj4.mongodb.net/camp?retryWrites=true&w=majority"


async function connectMongo() {
    try {
        await mongoose.connect(url)
        console.log("hello")
    } catch (error) {
        console.error(error)
    }
    
}

connectMongo()

app.listen(5050,()=>{
    console.log('app is running')
})