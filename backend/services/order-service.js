const { connectRabbitMq } = require("../config/rabbitmq-config")
const {Order} = require("../models")
const db = require("../models/index")
const AppError = require("../utils/appError")

const createOrderService=async()=>{
    const transact =await db.sequelize.transaction()
    try {
        console.log("create order service running")
        const exchangeName ="payment_success"
        const queueName ="payment"
        const channel = await connectRabbitMq()
        await channel.assertExchange(exchangeName,"fanout",{durable:true})
        await channel.assertQueue(queueName,{durable:true})
        await channel.bindQueue(queueName,exchangeName,"")
        channel.consume(queueName, async(msg)=>{
            try {
                const msgContent=JSON.parse(msg.content)
                console.log(msgContent)
                const order = await Order.create({
                      email:msgContent.metadata.email,
                      paymentRef:msgContent.metadata.paymentRef,
                      address: msgContent.metadata.address,
                      number:msgContent.metadata.number,
                      productId:msgContent.metadata.productId,
                      amount: msgContent.amount,
                      owner:msgContent.metadata.owner,
                      designerId:msgContent.metadata.designer_id
                },{transaction:transact})
                channel.ack(msg)
                await transact.commit()
                console.log(updateOrder)
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


const getAllOrderService= async(next)=>{
    try {
      const allOrders = await Order.findAll({order: [["createdAt", "DESC"]]},{raw:true})
  
      if (allOrders.length===0) {
        const err = new AppError("No new orders yet","success", 200)
        throw err
      }
     return allOrders
    } catch (error) {
      next(error)
    }
  }


  const getOrderByIdService=async(id,next)=>{
    try {
        const singleOrder = await Order.findByPk(id)

        if (!singleOrder) {
            const err = new AppError("Order not found","success", 400)
            throw err  
        }
        const orderDetails = singleOrder.get({plain:true})
        return orderDetails
    } catch (error) {
        next(error)
    }
  }
module.exports= {createOrderService,getOrderByIdService,getAllOrderService}