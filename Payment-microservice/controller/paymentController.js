const { connectRabbitMq } = require("../config/rabbitmq")
const { initiatePaymentService, webhookSeviceService } = require("../service/paymentService")
const AppError = require("../utils/appError")

  

  const paymentController =async (req,res,next)=>{
       const data = req.body
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


  const webhookController =async (req,res,next)=>{
    const data = req.body
   try {
    const orderInfo = await webhookSeviceService(data,next)
    console.log(orderInfo)
    const channel =await connectRabbitMq()
    const exchangeName = "payment_success"
    await channel.assertExchange(exchangeName, "fanout", {durable:true})
    //send order to the 

     return res.status(200).end()
   } catch (error) {
     next(error)
   }
  }

  module.exports = {paymentController}