async function sendMessage(event){
    event.preventDefault()
    const message=event.target.message.value
    const token=localStorage.getItem("token")
    console.log(message)
    console.log(token)
    const obj={
        message:message
    }
    const response=await axios.post("http://localhost:4000/messages/sendMessage",obj,{headers :{"Authorization" :token}}) 
    console.log(response)

}