let postForm=document.querySelector("#postForm")
let onlinesContainer=document.querySelector("#onlinesContainer")
let postsContainer=document.querySelector("#postsContainer")
let privateMessages=document.querySelector("#private_messages_block")
let nonFriendUsersContainer=document.querySelector("#nonFriendUsersContainer")
let friendRequestContainer=document.querySelector("#friendRequestContianer")
let logOut=document.querySelector("#logOut")


const userHomeId=document.body.id
//friend component
function friendComponent(user){
       document.write(` <section class="m-3">
                    <p><img src="/images/${ user.image }" width="50" height="50">
                    ${ user.username}</p>
                    <p>
                        <button id="${  user._id}" class="btn btn-primary m-1">Confirm</button>
                        <button id="${  user._id}"  class="btn btn-primary m-1">Cancel</button>
                    </p>
        </section>`)              
}

//friend reuest  component

function  friendRequestComponent(user){
   document.write(` <section class="m-3">
    <p><img src="/images/${ user.image }" width="50" height="50">
    ${ user.username}</p>
    <p>
        <button id="${  user._id}" class="btn btn-primary m-1">Message</button>
        <a href="/profile/${ user._id}" ><button class="btn btn-primary m-1">View Profile</button></a>
    </p>
   </section>`)
}

//this function is adding online user
const addNewUser=(user)=>{

     if(!!document.getElementById(user._id)){
               return
   }
     
    onlinesContainer.insertAdjacentHTML("afterbegin",`<section class="onlineUser" id="${user._id }">
    <img src="/images/${user.image }" class="onlineUserImage">
    <img src="/images/circle.gif"  class="onlineUserIcon">
    ${ user .username}</p>
</section>`)

    
}

//one private message

const privateMessageContainer=(accepterId, name, userId)=>{
   
    privateMessages.insertAdjacentHTML("afterbegin",` 
    <section class="private_message_container ${accepterId}">
    <div class="header">
        <div class="accepter">
            ${name}
        </div>
        <button type="button" class="btn-close close" aria-label="Close"></button>
        
    </div>
    <div class="messageContainer">
   
        
    </div>  


    <form action="" class="chatForm">
        <textarea type="text" name="text"></textarea>
        <input type="hidden" name="to" value="${accepterId}">
        <input type="hidden" name="from" value="${userId}">
        <input type="submit" value="Send" class="chatFormBtn">
    </form>
</section>`)
}

//one message in private container

const privateMessageItem=(msgId, text,from, updatedAt, id)=>{

    let messageBlock=document.getElementsByClassName(id)[0]
    let messageContainer=messageBlock.querySelector(".messageContainer")
    let oneMessageContainer=document.createElement("section")
    oneMessageContainer.id=msgId

    if(userHomeId==from){
        oneMessageContainer.style.cssText=`
        float:right;
        background-color:lightblue;
        margin:10px
        `
    }else{
        oneMessageContainer.style.cssText=`
            float:left; 
            background-color:lightgrey;
            margin:10px
            `
    }
     oneMessageContainer.insertAdjacentHTML("beforeend", ` 
     <p><b>${text}</b><br>
       ${new Date(updatedAt).toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}<p>
     `)
     messageContainer.prepend(oneMessageContainer)
}

//one post container

//one post container

function postComponent(post){
    postsContainer.insertAdjacentHTML(`afterbegin`,`
    <section id='${post._id}' class="mb-5" >
      <p  class="display-4">${post.post}</p>
      <h1><img src="/images/${post.author.image}" id="homeImg" width="50" height="50">
      ${post.author.username}</h1>
      <p>${post.updatedAt}</p>
     
     </section>`)         
   }

   function minuteNotifyer(title,content){
       document.body.insertAdjacentHTML(`afterbegin`,`
       <div id="minuteNotifyer">
       <h1>${title}</h1>
       <p>${content}</p>
       </div>
       `)    
     setTimeout(()=>{
              document.querySelector(`#minuteNotifyer`).remove()
    },10000)
   }

   function oneFreindReuest(user){

    friendRequestContainer.insertAdjacentHTML(`afterbegin`,`   
     <section class="m-3" >
    <p><img src="/images/${ user.image  }" width="50" height="50">
    ${ user.username }</p>
    <p  class='${  user._id }'>
        <button id="${  user._id }" class="btn btn-primary m-1 confirmButton">Confirm</button>
        <button id="${  user._id }"  class="btn btn-primary m-1">Cancel</button>
    </p>
</section>`)

   }