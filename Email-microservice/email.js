const { connectRabbitMq } = require("./config/rabbitMq")
require("dotenv").config()
const emailService  = async()=>{
    const channel = await connectRabbitMq()
  
    const queueName ="email_service"
    const exchangeName = "oneofone_exchange"
    await channel.assertExchange(exchangeName,"direct",{durable:true})
    await channel.assertQueue(queueName,{durable:true})
    await channel.bindQueue(queueName,exchangeName,"Email_approval")
    channel.consume(queueName,async(msg)=>{
       try {
         const msgContent=JSON.parse(msg.content)
         console.log(msgContent)
         if (msgContent.status ==="accepted") {
          //send approval mail
         }
         //send rejection mail
        channel.ack(msg)
       } catch (error) {
        channel.nack(msg)
        console.log(error)
       }

    })
   
}

emailService()