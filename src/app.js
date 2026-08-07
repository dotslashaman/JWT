const express = require("express");
const app = express();
app.use(express.json());
const validateMobileAndEmail = require('./userValidation.js');

const users = [];




app.get('/serverStatus', (req,res) => {
    res.status(200).json({
        "msg" : "Engpoints are working"
    })
})

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


app.post('/logIn', validateMobileAndEmail, (req,res) => {

})




module.exports = app;