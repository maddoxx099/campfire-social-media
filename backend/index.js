//mongo setup
const mongoose = require("mongoose");
const express = require("express");
//const dotenv = require("dotenv");
const app = express();
const cors = require('cors');
app.use(cors());


//require("dotenv").config();
const url = process.env.MONGO_URI


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