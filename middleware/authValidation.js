const joi=require("joi")

function signupValidation(req, res, next) {
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string()
            .pattern(/^[a-zA-Z0-9._%+-]+@student\.nust\.edu\.pk$/)
            .required()
            ,
        password: joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Please use your NUST email address.", error: error.details[0].message,success:false });
    }

    next();
}


function loginValidation(req,res,next){
    const schema=joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required()
    })

    const {error}=schema.validate(req.body)
    if(error){
        return res.status(400).json({message:"Bad Request",error:error.details[0].message,success:false})
    }
    next()

}

module.exports={signupValidation,loginValidation}