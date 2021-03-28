//chage User Info
let userDatailSection =document.querySelector("#userDetails")
let editProfileBtn =document.querySelector(".editProfile")
let userId=document.querySelector("#userId").innerHTML

editProfileBtn.addEventListener("click",()=>{
    userDeatailsForm()

})

//change profile image

let imgFile=document.querySelector("#imageFile")
let editImageBtn=document.querySelector("#editImageBtn")
let changeBtn=document.querySelector("#changeBtn")
let cancelChangeBtn=document.querySelector("#cancelChangeBtn")
let editImageSection=document.querySelector("#editImage")
let homeImg=document.querySelector("#homeImg")

imgFile.addEventListener("change",()=>{
    let link=URL.createObjectURL(imgFile.files[0])
    homeImg.src=link
})
//open changing part

cancelChangeBtn.addEventListener("click",()=>{
  imgFile.value=""  
  editImageBtn.hidden=true;
  editImageSection.hidden=false
  

})
editImageBtn.addEventListener("click",()=>{
    editImageBtn.hidden=true;
    editImageSection.hidden=false
  
  })

//change prifile photo
changeBtn.addEventListener("click",()=>{
    let formData=new FormData()
    let img=imgFile.files[0]
    formData.append("avatar",img)
    formData.append("username","vardan")
    fetch("/changePhoto",{
        method:"Post",
         body:formData
    }).then(res=>res.json())
    .then(data=>{
        homeImg.src="/images/"+data
        imgFile.value=""
        editImageBtn.hidden=false;
        editImageSection.hidden=true
    })
    



})



function userDeatailsForm(){
    userDatailSection.insertAdjacentHTML("beforeend",`<form class="container bg-dark text-white p-6" id="userDetailsForm">
     <div class="row">
         <p class="col-md-6 p-2 ">
             FirstName<input type="text" class="form-control" name="firstname">
         </p>
         <p class="col-md-6 p-2">
            LastName <input type="text" class="form-control" name="lastname">
         </p>
         <p class="col-md-6 p-2">
             Phone<input type="text" class="form-control" name="phone">
         </p>
         <p class="col-md-6 p-2">
             Workplace<input type="text" class="form-control" name="workplace">
         </p>
         <p class="col-md-6 p-2">
             Educatoion<input type="text" class="form-control" name="education">
         </p>
         <p class="col-md-6 p-2">
             City<input type="text" class="form-control" name="city">
         </p>
         <p class="p-2">
             <inp
         </p>
       
      
     </div>
   



 
 </form>`)

 let saveBtn=document.createElement("button")
 saveBtn.addEventListener("click",(e)=>{
     e.preventDefault()
     let updateContent={
          firstname:userDetailsForm.elements["firstname"].value,
          lastname:userDetailsForm.elements["lastname"].value,
          phone:userDetailsForm.elements["phone"].value,
          workplace:userDetailsForm.elements["workplace"].value,
          education:userDetailsForm.elements["education"].value,
          city:userDetailsForm.elements["city"].value,
          
         
     }
     console.log(updateContent)
	fetch('/profile/'+userId,{
        method:"PUT",
        headers:{
            'Content-Type':'application/JSON',
			'Accept':'application/JSON'
        },
        body:JSON.stringify(updateContent)
	})
	.then(res=>res.json())
	.then(data=>{
       console.log(data)

       Object.keys(data).forEach((key) => {
        if(data[key]){
            let id="#"+key
            document.querySelector(id).innerHTML = data[key];
         
        }
        
      });
       cancelBtn.parentNode.remove()

   })
}) 
 saveBtn.innerHTML="Save"
  userDetailsForm.append(saveBtn)

 let cancelBtn=document.createElement("button")
 cancelBtn.addEventListener("click",(e)=>{
    e.preventDefault()

    saveBtn.parentNode.remove()
 })
 cancelBtn.innerHTML="Cancel"
 userDetailsForm.append(cancelBtn)
}

//delete friend

let friendsContainer=document.querySelector('#friendsContainer')

friendsContainer.addEventListener(`click`,(e)=>{
      if(e.target.classList.contains('deleteFriendButton')){
        let result=confirm('Are you sure?')
        if(result){
           let info={
               me:userId,
               friend:e.target.id 
           } 
            fetch(`/deleteFriend/`,{
            method: 'Post',
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify(info)
          })
           .then(res=>res.json())
           .then(data=>{
               if(data.error){
                   alert(data.error)
                   return
               }
               e.target.parentNode.parentNode.remove()
           })
        }
        
    }
})