const Joi=require("@hapi/joi")
const {UserModel}=require("../models/UserModel")

const validateRegister=(req,res,next)=>{
    const Schema=Joi.object({
        username:Joi.string().min(6).max(255).required(),
        email:Joi.string().min(6).max(255).required().email(),
        password:Joi.string().min(6).max(255).required(),

    })
    const {error}=Schema.validate(req.body)

    if(error) return res.json({error:error.details[0].message})
     next()

}

const validateLogin=(req,res,next)=>{
    const Schema=Joi.object({
        email:Joi.string().min(6).max(255).required().email(),
        password:Joi.string().min(6).max(255).required(),

    })
    const {error}=Schema.validate(req.body)

    if(error) return res.json({error:error.details[0].message})
    console.log(req.body)
      next()

}

const checkEmailUnique= async (req,res, next)=>{

    let user =await UserModel.findOne({email:req.body.email})

    if(user) return res.json({error:"Email "+ user.email +" is taken"})
    
    next()
}

module.exports={
    validateRegister,
    validateLogin,
    checkEmailUnique
}
