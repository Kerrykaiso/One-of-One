const { initiatePaymentService } = require("../service/paymentService")
const AppError = require("../utils/appError")

  

  const paymentController =async (req,res,next)=>{
       const data = req.body
   try {
    const url = await initiatePaymentService(data,next)
    if (!url) {
        const appErr = new AppError()
    }
   } catch (error) {
    
   }
  }