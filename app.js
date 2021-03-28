const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors=require("cors")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const fs=require("fs")
const helmet = require("helmet");

const passport=require("./middlewares/auth")

dotenv.config()


//mongo connect
mongoose.connect(process.env.mongoLink,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,

})
const db=mongoose.connection
db.on("error", (err)=>{
  console.log(err)
})
db.on("connected",()=>{
  console.log("connected")
})

const PostModel=require("./models/PostModel")

const indexRouter = require('./routes/IndexRouter');
const authRouter = require('./routes/AuthRouter');
const adminRouter = require('./routes/AdminRouter');
const { createMessage } = require('./models/MessageModel');
const { UserModel, getOneUser } = require('./models/UserModel');

const app = express();
const server = require("http").createServer(app);
const io=require("socket.io")(server)


io.on("connection",(socket)=>{
 //when new user join
  socket.on("new user",async (userId)=>{

    try{
      let user=await UserModel.findById(userId).select("username image")
      user.status.online=true
      user.status.socketId=socket.id
      await user.save()
      socket.userId=userId
      
      socket.broadcast.emit("new user", user)
    }catch(err){
      io.to(socket.id).emit("error", {error:err.message})
    }

  })

//when user leave

socket.on("disconnect",async ()=>{
  try{
    
    let user=await UserModel.findOne({_id:socket.userId})
    if(user){
    
        user.status.online=false
        await user.save()
        socket.emit("user disconnected", socket.userId)
       }
      
  }catch(err){
    console.log(err)
  }  
 
})

//logOut
socket.on("logOut",async(userId)=>{
  try{
       socket.broadcast.emit("user disconnected", userId)
    
         
  }catch(err){
    console.log(err)

  }  
 
})
  //friend request
   socket.on("friend request",async (data)=>{
     try{
       let userAccepter=await UserModel.findOne({_id:data.accepter})
       let userSender=await UserModel.findOne({_id:data.sender}).lean().exec()
       if(!userAccepter.friendRequest.includes(data.sender)){
          userAccepter.friendRequest.push(data.sender)
       }
        await userAccepter.save()
       if(userAccepter.status.online){
         io.to(userAccepter.status.socketId).emit("friend request", userSender)
       }      
        io.to(userSender.status.socketId).emit("requestSended", data.accepter)
             
    }catch(err){
              io.to(userSender.status.socketId).emit("error",{error:err.message})
    }
      
  })

//confirmRequest

socket.on("confirmRequest",async (data)=>{
 
try{
  //Accepter Object how confirm request
  let userAccepter=await UserModel.findOne({_id:data.accepterConfirm})
  //Sender Object how sent request
  let userSender=await UserModel.findOne({_id:data.senderRequest})
  //pushing id friends field in evry object
  if(!userAccepter.friends.includes(data.senderRequest)){
     userAccepter.friends.push(data.senderRequest)
  }
  
  if(!userSender.friends.includes(data.accepterConfirm)){
    userSender.friends.push(data.accepterConfirm)
 }
 //remuving from friendRequest id of sender
   userAccepter.friendRequest.splice(userAccepter.friendRequest.indexOf(data.senderRequest),1)
  
  await userAccepter.save()
  await userSender.save()

   if(userSender.status.online){
      io.to(userSender.status.socketId).emit("confirmRequest",userAccepter)
    } 
    console.log(userAccepter.status.socketId)
   io.to(userAccepter.status.socketId).emit("requestAccepeted", data.senderRequest)

   
  }catch(err){
      console.log(err)
      io.to(userAccepter.status.socketId).emit("error",{error:err.message})
  }
 
})

// add new post

socket.on("new post",async (data)=>{
   let createPost=new  PostModel({
         post:data.post,
         author:data.userId
   })
   
   createPost.populate("author").execPopulate();
   let newPost=await createPost.save()
   io.emit("new post", newPost)
})

//private messages

socket.on("private message",async (data)=>{
     try{
       let savedMessage=await createMessage(data)
       let userTo=await getOneUser(data.to)
       let userFrom=await getOneUser(data.from)
       io.to(userFrom.status.socketId).emit("private message me",savedMessage)
        if(userTo.status.online){
         let objMsg={
           msg: savedMessage,
           user:userFrom.username
         }
         io.to(userTo.status.socketId).emit("private message",objMsg)
       }
      }catch(err){
        console.log(err)
        io.to(userFrom.status.socketId).emit({error:err.message})

      }
})      
       

})
//end socket

//morgan
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs",'access.log'), {flags: 'a'}
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.cookieSecret));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize)
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan('combined', {stream: accessLogStream}));

app.use(function(req, res, next) {
  req.io=io
  next();
});

app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/admin',passport.passport.authenticate("jwt", {session: false}), adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports= {app, server}
