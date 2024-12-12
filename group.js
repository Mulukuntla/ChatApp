var numbers;

async function sendMessage(event){
    event.preventDefault()
    const message=event.target.message.value
    const token=localStorage.getItem("token")
    const groupId=localStorage.getItem("groupId")
    console.log(groupId)
    if(groupId ==null){
        return alert("add Groups")
    }
    const user=parseJwt(token)
    console.log(message)
    console.log(token)
    const obj={
        name:user.name,
        message:message,
    }
    const response=await axios.post(`http://localhost:4000/messages/sendMessage/${groupId}`,obj,{headers :{"Authorization" :token}}) 
    const updatedMessage=response.data.message.message
    console.log(updatedMessage)
    console.log(user.name)
    updatedsendMessage(user.name,updatedMessage)
    updateSendMessageLink()
    document.getElementById("message").value=""
    
   

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
    const a = document.getElementById("chats");
   

    if (message.includes("http")) {
        // Generate message with a clickable link
        numbers=numbers+1
        b = `<div class="message">${name}:<a href="#" id="${numbers}a">${message}</a></div>`;
        a.innerHTML += b; // Append the new message to the chat

        // Add an event listener to the link
    } else {
        // Generate a normal message
        b = `<div class="message">${name}: ${message}</div>`;
        a.innerHTML += b;
    }

}
document.addEventListener('DOMContentLoaded',async function () {
    //setInterval(allMessages,1000)
    localStorage.removeItem('groupId');
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://localhost:4000/group/allgroups`,{headers :{"Authorization" :token}}) 
    console.log(response)
    const element=response.data.groups
    groups(element)
    
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


async function groupAdded(event){
    try{
        event.preventDefault()
        const groupName=event.target.groupName.value
        console.log(groupName)
        const obj={
            group:groupName
        }
        const token=localStorage.getItem("token")
        const ress=await axios.post("http://localhost:4000/group/addgroup",obj,{headers :{"Authorization" :token}}) 
        console.log(ress)
        const groups=document.getElementById("groups")
        const groupItem = document.createElement("li");
        groupItem.className ="group-item";
        groupItem.textContent = ress.data.groupName
        groupItem.id = ress.data.groupId;  // Display the group name
        groupItem.addEventListener("click", () => getChat(ress.data.groupId,ress.data.groupName,ress.data.inviteLink));
        groups.appendChild(groupItem);
        
        
        document.getElementById("addGroup").value=""
}catch(err){
        console.log(err)
    }
}











function groups(element){
    console.log(element)
    
    const groups=document.getElementById("groups")
    groups.innerHTML=""
    element.forEach(group => {
        const groupItem = document.createElement("li");
        console.log(group.group.groupName)
        groupItem.className ="group-item";
        groupItem.textContent = group.group.groupName;
        groupItem.id = group.group.id;  // Display the group name
        groupItem.addEventListener("click", () => getChat(group.group.id, group.group.groupName,group.group.inviteLink));
        groups.appendChild(groupItem);
       
      });

}

async function getChat(groupId,groupName,inviteLink){
    console.log(inviteLink)
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://localhost:4000/messages/allMessages/${groupId}`,{headers :{"Authorization" :token}}) 
    const a=document.getElementById("chats")
    a.innerHTML=""
    if(response.data.allMessages.length ===0){
        a.innerHTML=`
        <a>Start Messaging</a>
        `
    }
    console.log(response)
    numbers=0
    response.data.allMessages.forEach(element => {
        updatedsendMessage(element.userName,element.message)
    });
    console.log(numbers)
    for(let i=1;i<= numbers;i++){
        const link = document.getElementById(`${i}a`);
        console.log(link)
        const messagee=link.textContent
        console.log(messagee)
        link.addEventListener("click", function (event) {
            console.log("Link clicked");
            event.preventDefault(); // Prevent default link behavior
            addMembersInGroup(messagee); // Call the function with the message
        });

    }
    
    localStorage.setItem("groupId",groupId)
    const groupInvite=document.getElementById("group-invite")
    const b=`
        <p>Invite Link: <a href="http://localhost:4000/group/allgroups/invite/${inviteLink}" >http://localhost:4000/group/allgroups/invite/${inviteLink}</a></p>
    `
    groupInvite.innerHTML=b
    

}

async function addMembersInGroup(message){
    try{
        console.log("Hi")
        const token=localStorage.getItem("token")
        console.log(message)
        const response=await axios.get(message,{headers :{"Authorization" :token}}) 
        console.log(response)
        if(response.data.messagess ="User added to the group"){
            console.log("Hi")
            allMessages()
        }
        else{
            console.log("Hii")
            
        }
        

    }
   catch(err){
    console.log(err)
   }
    
}
async function allMessages(){
    try{ 
        const group=localStorage.getItem("group")
        const token=localStorage.getItem("token")
        const response=await axios.get(`http://localhost:4000/group/allgroups`,{headers :{"Authorization" :token}}) 
        console.log(response)
        const element=response.data.groups
        groups(element)
    
        const groupId=localStorage.getItem("groupId")
        
        const responsee=await axios.get(`http://localhost:4000/messages/allMessages/${groupId}`,{headers :{"Authorization" :token}}) 
        const a=document.getElementById("chats")
        a.innerHTML=""
        responsee.data.allMessages.forEach(element => {
            updatedsendMessage(element.userName,element.message)
            
        });
        
    }
    
    catch(err){

    }
}

function linkss(links,message){
    console.log(links)
    links.addEventListener("click", function (event) {
        console.log("Hi")
        event.preventDefault(); // Optional: prevent default link behavior
        console.log("Hi")
        addMembersInGroup(message)
    });
}




function updateSendMessageLink(){
    const link = document.getElementById(`${numbers}a`);
    console.log(link)
    const messagee=link.textContent
    console.log(messagee)
    link.addEventListener("click", function (event) {
        console.log("Link clicked");
        event.preventDefault(); // Prevent default link behavior
        addMembersInGroup(messagee); // Call the function with the message
    });

}














