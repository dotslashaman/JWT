const express = require("express");
const app = express();
app.use(express.json());
const validateMobileAndEmail = require('./userValidation.js');



app.get('/serverStatus', (req,res) => {
    res.status(200).json({
        "msg" : "Engpoints are working"
    })
})
app.post('/signUp', validateMobileAndEmail, (req,res) => {

});




module.exports = app;