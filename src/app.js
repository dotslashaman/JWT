require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const validateMobileAndEmail = require('./userValidation.js');
const { errors } = require('playwright');
const users = [];

const mongourl = process.env.mongoUrl;

mongoose.connect(mongourl)
.then(() => {
    console.log("Connected to database");
})
.catch((error) => {
    console.log(error);
});

const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : String,
    mobileNumber : String,
    password : String
});

const dbUser = mongoose.model('Users', userSchema);


app.get('/serverStatus', (req,res) => {
    res.status(200).json({
        "msg" : "Engpoints are working"
    })
})

const jwtSecret = process.env.JWT_SECRET;

app.post('/signUp', validateMobileAndEmail, async (req,res) => {

    const id = req.body.mobileNumber;
    console.log("id is", id);

    const checkExisting = await dbUser.findOne({mobileNumber : id});

    if(checkExisting){
        return res.status(400).json({
            "msg" : "Error : User with same mobile already present"
        });
    }

  
    const tempUser = await new dbUser(req.body);
    await tempUser.save();
    console.log(req.body);
    res.status(201).json({
        "msg" : "User created successfully"
    });
    
});

app.post('/logIn', async (req,res) => {
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    
    const checkExisting = await dbUser.findOne({mobileNumber,password});
    if(!checkExisting){
        return res.status(400).json({
            "msg" : "Invalid credentials, user not found"
        });
    }

    const token = jwt.sign(
        {mobileNumber : checkExisting.mobileNumber},
        jwtSecret,
        {expiresIn : '1h'}
    )


    res.status(200).json({
        "msg" : "Login Successful",
        "token" : token
    });
})



module.exports = app;