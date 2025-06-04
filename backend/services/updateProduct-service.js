const { connectRabbitMq } = require("../config/rabbitmq-config")
const db = require("../models/index")
const {Product} = require("../models")
const AppError = require("../utils/appError")


const updateProductService =async()=>{
    const transact =await db.sequelize.transaction()
    try {
        console.log("update product service running")
        const exchangeName ="payment_success"
        const queueName ="payment"
        const channel = await connectRabbitMq()
        await channel.assertExchange(exchangeName,"fanout",{durable:true})
        await channel.assertQueue(queueName,{durable:true})
        await channel.bindQueue(queueName,exchangeName,"")
        channel.consume(queueName, async(msg)=>{
            try {
                const msgContent=JSON.parse(msg.content.metadata)
                console.log(msgContent)
                const product = await Product.findByPk(msgContent.productId)
                const updatedProduct = await product.update({owner:msgContent.owner,status:"sold"},{transaction:transact})
                channel.ack(msg)
                await transact.commit()
                console.log(updatedProduct)
            } catch (error) {
                await transact.rollback()
                const err = new AppError(error.message,"failed",400)
                throw err
            }
        })
    } catch (error) {
        const err = new AppError(error.message,"failed",400)
        throw err
    }
}



const createProductService = async()=>{
    const transact =await db.sequelize.transaction()
  try {
    console.log("Create product service")
        const exchangeName ="create_product"
        const queueName ="product"
        const channel = await connectRabbitMq()
        await channel.assertExchange(exchangeName,"direct",{durable:true}) 
        await channel.assertQueue(queueName,{durable:true})
        await channel.bindQueue(queueName,exchangeName,"")
          channel.consume(queueName, async(msg)=>{
            try {
                const msgContent=JSON.parse(msg.content.metadata)
                console.log(msgContent)
                await Product.create(msgContent,{transaction:transact})
                channel.ack(msg)
                await transact.commit()
            } catch (error) {
                await transact.rollback()
                const err = new AppError(error.message,"failed",400)
                throw err
            }
        })
  } catch (error) {
    const err = new AppError(error.message,"failed",400)
    throw err
  }
}
module.exports={updateProductService, createProductService}