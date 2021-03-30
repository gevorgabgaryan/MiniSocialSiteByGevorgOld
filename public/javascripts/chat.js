const socket=io()

const newUser=()=>{

    socket.emit("new user",userHomeId)
     
}
//new user join
newUser()

//others see new user join
socket.on("new user",(data)=>{
    //components/index addNewUser function
    addNewUser(data)
 
})


//leave user

socket.on("user disconnected", function (userId) {
      onlinesContainer.querySelector(`#o_${userId}`).remove();
  });


//add post


postForm.addEventListener("submit",(e)=>{
   e.preventDefault()
   let newPost={
       post:postForm.elements[0].value,
       username:postForm.elements["username"].value,
       userId:postForm.elements["userId"].value,
   }
   postForm.elements[0].value=""
   socket.emit("new post",newPost)
})




socket.on("new post",(data)=>{
    postComponent(data)
})

/** New Post */

//private message
  //opening block


  onlinesContainer.addEventListener("click",(e)=>{
       if(e.target.className=="onlineUser" || e.target.closest('.onlineUser')){            
                let id=e.target.id.slice(2) || e.target.closest('.onlineUser').id.slice(2)
                data.from   let name=e.target.textContent.trim() || e.target.closest('.onlineUser').textContent.trim()
                privateMessageContainer(id,name,userHomeId)
                let privateObj={
                    from:userHomeId,
                    to:id
                } 
            
                fetch("/privatemessage",{
                method:"POST",
                headers:{
                    "Content-Type":"application/JSON",
                    "Accept":"application/JSON",
                },
                body:JSON.stringify(privateObj)

                }).then(res=>res.json())
                .then(data=>{
                    
                    data.forEach((msg)=>{
                        privateMessageItem(msg._id,msg.text,msg.from,msg.updatedAt,id )
                    })
                    
                })               
       }
  })






  //add chat message sender


  privateMessages.addEventListener("click",(e)=>{

     if(e.target.className=="chatFormBtn"){
         e.preventDefault()
         let chatForm=e.target.parentNode
         let chatInfoObj={
             text:chatForm.elements["text"].value,
             to:chatForm.elements["to"].value,
             from:chatForm.elements["from"].value,
         }
     
         socket.emit("private message",chatInfoObj)
         chatForm.reset()
     }
     if(e.target.className=="btn-close close"){
       e.target.parentNode.parentNode.remove()
       }
  })

  //gettin private message

  socket.on("private message",(data)=>{

   if(!document.getElementsByClassName(data.msg.from)[0]){
    let privateObj={
        from:userHomeId,
        to:data.msg.from
    } 
    fetch("/privatemessage",{
        method:"POST",
        headers:{
            "Content-Type":"application/JSON",
            "Accept":"application/JSON",
        },
        body:JSON.stringify(privateObj)
 
       }).then(res=>res.json())
       .then(result=>{
          
         result.forEach((msg)=>{
                privateMessageItem(msg._id,msg.text,msg.from,msg.updatedAt,data.msg.from )
          })
           
       })
       privateMessageContainer(data.msg.from, data.user,data.msg.to)
   }

      privateMessageItem(data.msg._id,data.msg.text,data.msg.from,data.msg.updatedAt,data.msg.from )
  })



  socket.on("private message me",(msg)=>{
    privateMessageItem(msg._id,msg.text,msg.from,msg.updatedAt, msg.to)
  })
  


/*  Add friend*/

nonFriendUsersContainer.addEventListener("click",(e)=>{
    if(e.target.classList.contains('addFriendButton')){
        classN=e.target.parentNode.className.slice(2)
        let freindRequestObj={
            sender:userHomeId,
            accepter:classN
        } 
        socket.emit("friend request",freindRequestObj)
    }
})


socket.on("friend request",(data)=>{
    let {username}=data
    minuteNotifyer('New Frien Request',`Freind request send ${username}`)
    oneFreindReuest(data)

  })

  socket.on("requestSended",(data)=>{
           document.getElementsByClassName("nf"+data)[0].parentNode.remove()
  })

  //acept Request


friendRequestContainer.addEventListener("click",(e)=>{
        if(e.target.classList.contains('confirmButton')){
          let freindConfirmtObj={
            accepterConfirm:userHomeId,
            senderRequest:e.target.parentNode.className
          } 
         socket.emit("confirmRequest",freindConfirmtObj)
        }
    })


socket.on("requestAccepeted",(data)=>{
        document.getElementsByClassName(data)[0].parentNode.remove()
  })

socket.on("confirmRequest",(data)=>{
    let {username}=data
    minuteNotifyer('Request confirmed',`${username} accept request`)     
  })

socket.on('error',(data)=>{
    alert(data.error)
})
  

// on log out
logOut.addEventListener("click",(e)=>{
    socket.emit("logOut",userHomeId)
    location.href=`/auth/logOut/${userHomeId}`
})

