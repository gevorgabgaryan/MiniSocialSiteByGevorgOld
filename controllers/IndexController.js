const { UserModel }= require("../models/UserModel");
const PostModel=require("../models/PostModel")
const {MessageModel}=require("../models/MessageModel.js");

const path=require("path")
const fs=require("fs")
class IndexController{
 
      /**
       * Home page
       * @param {*} req 
       * @param {*} res 
       */
     async home(req,res){
      let userInfo=await UserModel.findOne({_id:req.user.id}).populate("friendRequest").lean().exec()     
      let nonFriendUsers=await UserModel.find({_id:{$nin:[req.user.id, ...userInfo.friends,...userInfo.friendRequest]}}).exec()
      let onlineUsers=await UserModel.find({"status.online":true, _id:{$nin:[req.user.id]}}).select("username image").lean().exec()
      let posts=await PostModel.find({}).populate("author").sort({createdAt:-1}).lean().exec()
      let friendRequests=userInfo.friendRequest
       res.render("home",{userInfo:req.user, posts, nonFriendUsers,onlineUsers,friendRequests})
      }
     /**
      * Profile page
      * @param {*} req 
      * @param {*} res 
      */
     
      async profile(req,res){
  
        let allUsers=await UserModel.find()
        let posts=await PostModel.find({author:req.params.id}).populate("author").sort({createdAt:-1}).exec()
        let userInfo=await UserModel.findOne({_id:req.params.id}).populate("friends").populate("friendRequest").lean().exec()
        res.render("profile",{
           userId:req.user.id,
           posts,
           userInfo,
           allUsers
        
          })
       }
      /**
       * changing profile phote
       * @param {*} req 
       * @param {*} res 
       */
      async  changePhoto(req,res){
        try{
         
          let user=await UserModel.findById(req.user.id)
          
            let oldImageName=user.image
            user.image=req.file.filename
          let userNeInfo=await user.save()
           res.json(userNeInfo.image)

           try{
            if(oldImageName!="/default_profile.png"){
                    fs.unlink(path.join(__dirname,"..","/public/images/",oldImageName),(err)=>{
                      
                       })
                            
                }
           }catch(err){
           
           }
     
            
        }catch(err){

          res.json(err)
        }
         
   
       }
      async updateUserDetails(req,res){
        try{
            let data=req.body
            let user=await UserModel.findOne({_id:req.params.id})
            
            Object.keys(data).forEach((key) => {
        
              if(data[key]){
                user[key] = data[key];
              }
              
            });
            let userInfo=await user.save()
            res.json(data)
                 

        }catch(err){
          res.json(err)
        }
      } 
   getPrivateMessages(req,res){
      MessageModel.find({$or:[
          {to:req.body.to,from:req.body.from},
          {to:req.body.from,from:req.body.to},
        ]}).sort({updatedAt:1}).exec((err,messages)=>{
           res.json(messages)
        })
     
        
      } 

      async deleteFriend(req,res){
       try{ 
        let me=await UserModel.findOne({_id:req.body.me});
        let friend=await UserModel.findOne({_id:req.body.friend});
        me.friends.splice(me.friends.indexOf(req.body.me),1)
        await me.save()
        friend.friends.splice(friend.friends.indexOf(req.body.friend),1)
        await friend.save()
        res.json({result:'done'})
       }catch(err){
         res.json({error:err.message})
       }
      }
}

module.exports=new IndexController()