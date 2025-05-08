const {connectRabbitMq} = require("../config/rabbitmq-config")
const { fundWalletService } = require("./wallet-service")

const fundWallet =async()=>{
     
    const queueName ="fund_service"
    const routingKey ="fund_success"
    const exchangeName = "oneofone_exchange"
    await channel.assertExchange(exchangeName,"direct",{durable:true})
    await channel.assertQueue(queueName,{durable:true})
    await channel.bindQueue(queueName,exchangeName,routingKey)
    channel.consume(queueName,async(msg)=>{
       try {
         const msgContent=JSON.parse(msg.content)
         const amount = msgContent.amount
         const designerId = msgContent.metadata.designerId
         console.log(msgContent)
         await fundWalletService(designerId,amount)
        channel.ack(msg)
       } catch (error) {
        channel.nack(msg)
        console.log(error)
       }

    })
}
 module.exports= {fundWallet}