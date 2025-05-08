const { connectRabbitMq } = require("../config/rabbitmq")
const { initiatePaymentService, webhookSeviceService, fundWallet } = require("../service/paymentService")
const AppError = require("../utils/appError")

  

  const paymentController =async (req,res,next)=>{
       const details = req.body
       const userId = req.data.id
      const data = {...details,userId}
   try {
    const paymentInfo = await initiatePaymentService(data,next)

    if (!paymentInfo) {
        const appErr = new AppError("Error initializing payment", "failed", 400)
        throw appErr
    }
    res.status(200).json({status:"success", url:paymentInfo.authorization_url})
   } catch (error) {
      next(error)  
   }
  }


const fundWalletController = async(req,res,next)=>{
  const amount = req.body
  const designerId = req.headers["x-user"].id
  const data ={amount,designerId}
  try {
    const fundingInfo = await fundWallet(data,next)

    if (!fundingInfo) {
      const appErr = new AppError("Error funding wallet", "failed", 400)
      throw appErr
    }
    res.status(201).json({status:"success",data:fundingInfo})
  } catch (error) {
    next(error)
  }
}




  const webhookController =async (req,res,next)=>{
    const data = req.body
   try {
     
      const Info = await webhookSeviceService(data,next)
      console.log(Info)
      if (Info.type ==="order") {

        const channel =await connectRabbitMq()
        const exchangeName = "payment_success"
        await channel.assertExchange(exchangeName, "fanout", {durable:true})
        channel.publish(exchangeName,"",Buffer.from(JSON.stringify(Info)))
        //send order to the 0rder service
       //update product
      } else if(Info.type==="funding"){

        const channel = await connectRabbitMq()
        const exchangeName = "oneofone_exchange" //change exchange if this doesnt work
        const routingKey = "fund_success"
        await channel.assertExchange(exchangeName, "direct", {durable:true})
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(Info)))    
      }
  
  
     
     return res.status(200).end()
   } catch (error) {
     next(error)
   }
  }

  module.exports = {paymentController,webhookController,fundWalletController}