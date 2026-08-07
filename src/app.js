require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const validateMobileAndEmail = require('./userValidation.js');
const users = [];

app.get('/serverStatus', (req,res) => {
    res.status(200).json({
        "msg" : "Engpoints are working"
    })
})

const jwtSecret = process.env.JWT_SECRET;

app.post('/signUp', validateMobileAndEmail, (req,res) => {

    const id = req.body.mobileNumber;
    const checkUser = users.some(user => user.mobileNumber == req.body.mobileNumber);

    if(checkUser){
        return res.status(400).json({
            "msg" : "Error : User with same mobile already present"
        });
    }

    users.push(req.body);
    console.log(req.body);
    res.status(201).json({
        "msg" : "User created successfully"
    });
    
});

app.post('/logIn', (req,res) => {
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    const userFind = users.find(u => u.mobileNumber == mobileNumber && u,password == password);
    if(!userFind){
        return res.status(400).json({
            "msg" : "Invalid credentials, user not found"
        });
    }

    const token = jwt.sign(
        {mobileNumber : userFind.mobileNumber},
        jwtSecret,
        {expiresIn : '1h'}
    )


    res.status(200).json({
        "msg" : "Login Successful",
        "token" : token
    });
})



module.exports = app;