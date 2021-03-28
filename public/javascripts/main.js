const loginForm=document.querySelector("#loginForm")

loginForm.addEventListener("submit", (e)=>{
    e.preventDefault()
     loginObj={
         email:loginForm.elements["email"].value,
         password:loginForm.elements["password"].value
     }
     fetch("/auth/login",{
         method:"POST",
         headers:{
             "Content-Type":"application/json",
             "Accept":"application/json",
         },
         body:JSON.stringify(loginObj)
     }).then(res=>res.json())
     .then(data=>{

        if(data.error){
           let elem= document.createElement("p")
           elem.innerHTML=JSON.stringify(data.error)
           loginForm.prepend(elem)
           return
        }
        localStorage.setItem("AuthToken", data.token)
         location.href="/"
     })



})