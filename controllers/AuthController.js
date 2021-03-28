const {UserModel}=require("../models/UserModel")
const jwt=require("jsonwebtoken")
class AuthController{
    registerView(req,res){
        let message=""
        res.render("register",{message:message})
    }

    async registerUser(req,res){
       
      try{
            let user=await UserModel.create({
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                })
            
                if(!user){
                
                        res.status(400).json({error:"Unexpected Error"})
                }
       
                res.redirect("/auth/login")
      }  catch(err){
                 res.status(400).json({error:err})
      }
   

    }
    loginView(req,res){
        let message=""
        res.render("login",{message:message})
    }
    async  loginUser(req,res){
            try{ 
                    const user= await UserModel.findOne({email:req.body.email}).exec()
              
                    if(!user){
                        return res.status(400).json({error:"Invalid Email or Password"})
                    }
                   
                  const passwordOk=await user.comparePassword(req.body.password);
                
                     if(!passwordOk){
                        return res.status(400).json({error:"Invalid Email or Password"})
                     }   
                 
                       const token = jwt.sign({
                        id: user._id,
                        username: user.username,
                        email: user.email
                      }, process.env.jwtSecret, {
                        expiresIn:"30d"
                      });
                 
                      res.cookie('jwt',token,{signed:true,httpOnly:true,maxAge: 30*86400000})
                      return res.json({user, token});
                     
               }catch(err){
                      
                        return res.status(400).json({error:"Invalid Email or Password"})
                    }   
             }
          async LogOut(req,res){
                        res.clearCookie('jwt')
                        let user=await UserModel.findById(req.params.id)
                      if(user){
                        user.status.online=false
                         await user.save()
                    
                       }
                       req.io.to(user.status.socketId).emit("user disconnected", user._id)
                       res.redirect('/auth/login')
                 }
                             
    }


module.exports=new AuthController()