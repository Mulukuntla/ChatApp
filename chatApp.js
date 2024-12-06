async function sendMessage(event){
    event.preventDefault()
    const message=event.target.message.value
    const token=localStorage.getItem("token")
    const user=parseJwt(token)
    console.log(message)
    console.log(token)
    const obj={
        name:user.name,
        message:message
    }
    const response=await axios.post("http://localhost:4000/messages/sendMessage",obj,{headers :{"Authorization" :token}}) 
    const updatedMessage=response.data.message
    console.log(updatedMessage)
    console.log(user.name)
    
   

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
} 

function updatedsendMessage(name,message){
    const a=document.getElementById("chats")
    const b=`<div class="message">${name}:${message}</div>`
    a.innerHTML=a.innerHTML+b

}






document.addEventListener('DOMContentLoaded',function () {
    setInterval(allMessages,1000)
    async function allMessages(){
        try{
            const a=document.getElementById("chats")
            a.innerHTML=""
            const token=localStorage.getItem("token")
            var messages=[]
            const response=await axios.get("http://localhost:4000/messages/allMessages",{headers :{"Authorization" :token}}) 
            response.data.allMessages.forEach(element => {
                updatedsendMessage(element.userName,element.message)
                //messages.push({id:element.id,userName:element.userName,message:element.message})
            });
            
            //localStorage.setItem("messages",JSON.stringify(messages))
            //const getAllMessages=localStorage.getItem("messages")
            //console.log(getAllMessages)
            //JSON.parse(getAllMessages).forEach(element => {
                //updatedsendMessage(element.userName,element.message)
                //messages.push({id:element.id,name:element.userName,message:element.message})
            //});
            
        }
        catch(error){
            console.log(error)
        }

    }
    
    
    
})



async function initial(){
    const token=localStorage.getItem("token")
    const user=parseJwt(token)
    const obj={
        name:user.name,
        message:"is joined"
    }
    const ress=await axios.post("http://localhost:4000/messages/sendMessage",obj,{headers :{"Authorization" :token}}) 
    console.log(ress)
    updatedsendMessage(user.name,ress.data.message)
}