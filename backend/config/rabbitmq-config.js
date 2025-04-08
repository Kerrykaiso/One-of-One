const amqp = require("amqplib")
const RABBITMQ_URL = process.env.RABBITMQ_URL

let channel, connection
const connectRabbitMq=async()=>{
   try {
    if (!connection) {
        connection = await amqp.connect(RABBITMQ_URL)
        connection.on("close",()=>{
            console.log("rabbitmq connection closed!")
        })
        connection.on("error",(err)=>{
          console.log(`rabbitmq connection error ${err}`)
        })
    }
    if (!channel) {
        channel = await connection.createChannel()
        console.log("channel created")
    }
    return channel
   } catch (error) {
     console.log(`failed to connect to rabbitmq ${error}`)
   }
}

module.exports= {connectRabbitMq}