const express = require("express");
const {z} = require("zod");

const app = express();

app.use(express.json());


function validateMobileAndEmail(req,res,next){
    
    const userSchema = z.object({
        name : z.string().max(10),
        age : z.number().min(18),
        email : z.string().email();
    })
}



app.get('/login', (req,res,validateMobileAndEmail) => {
    const userData = req.body; //expected is name, age, email, mobile
    

});