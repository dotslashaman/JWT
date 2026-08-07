const {z} = require("zod");

function validateMobileAndEmail(req,res,next){

    const userSchema = z.object({
        name : z.string().max(10, {

            message : "Name must not be greater than 10 characters"

        }),

        age : z.number().min(18, {

            message : "Age must be greater than 18" // checks for age 

        }),

        email : z.string().email(), // checks for string mail and validation

        mobileNumber : z.string().length(10, {
            message : "Mobile Number Should Be 10 Digits"
        })
    });

    const result = userSchema.safeParse(req.body);
    if(!result.success) {
       return res.status(400).json({
        "msg" : "User Validation Failed",
        "details" : result.error.format()
       })
    }else{
        next();
    }
}


module.exports = validateMobileAndEmail;