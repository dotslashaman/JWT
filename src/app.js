require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const { validateMobileAndEmail, validateLogin } = require('./userValidation.js');

const mongourl = process.env.mongoUrl;
const SALT_ROUNDS = 10;

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

const requireDbConnection = (req,res,next) => {
    if(mongoose.connection.readyState !== 1){
        return res.status(503).json({
            "msg" : "Database unavailable, please try again later"
        });
    }
    next();
};

app.post('/signUp', requireDbConnection, validateMobileAndEmail, async (req,res) => {

    const id = req.body.mobileNumber;
    console.log("id is", id);

    const checkExisting = await dbUser.findOne({mobileNumber : id});

    if(checkExisting){
        return res.status(400).json({
            "msg" : "Error : User with same mobile already present"
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const tempUser = new dbUser({...req.body, password : hashedPassword});
    await tempUser.save();
    res.status(201).json({
        "msg" : "User created successfully"
    });

});

app.post('/logIn', requireDbConnection, validateLogin, async (req,res) => {
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;

    const checkExisting = await dbUser.findOne({mobileNumber});
    if(!checkExisting || !(await bcrypt.compare(password, checkExisting.password))){
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