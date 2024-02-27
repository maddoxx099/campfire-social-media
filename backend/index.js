//mongo setup
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())


const url = process.env.MONGO_URI;


async function connectMongo() {
    try {
        await mongoose.connect(url)
        console.log("hello")
    } catch (error) {
        console.error(error)
    }
    
}

connectMongo()
const authRouter = require('./routes/auth');
const authUser = require('./routes/user');

app.use('/api/auth',authRouter)
app.use('/api/user',authUser)

app.listen(8000,()=>{
    console.log('app is running')
})