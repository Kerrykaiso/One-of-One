const { connectRabbitMq } = require("../config/rabbitmq-config");
const { checkDesignerTier } = require("../services/designer-profile");
const { submitDesignService, approveDesignService,getSubmissionsService } = require("../services/submit-design");
const { checkWalletBalance, debitWallet } = require("../services/wallet-service");
const AppError = require("../utils/appError");
const { escapeHtml } = require("../utils/emailUtils");

const submitController=async(req,res,next)=>{
 try {
  const color = req.body.color
  const price = req.body.price
  const category = req.body.category
  const designName =req.body.designName
   const userData = req.data
   const mockupImages = req.files["mockups"];
   const designImages = req.files["designs"];
    const submitSuccess = await submitDesignService(mockupImages,designImages,userData,color,designName,price,category,next)
    if (!submitSuccess) {
        const appErr = new AppError("failed to upload,something went wrong","failed",400)
        throw appErr
    }
    res.status(201).json("submitted success")
 } catch (error) {
    return next(error)
 }
}


const  approveDesignController =async(req,res,next)=>{
 try {
   const data = req.body
   const designerId = req.body.designerId
   const id = req.params.id
   
   const tier = await checkDesignerTier(designerId,next)

   if (tier==="premium") {
    const sufficientBalance = await checkWalletBalance(designerId,next)

    if (!sufficientBalance) {
      const appErr = new AppError("Insufficient wallet balance","failed",400)
      throw appErr
    }

    const debitDesignerWallet = await debitWallet(designerId,next)
    if (!debitDesignerWallet) {
      const appErr = new AppError("Error debiting wallet","failed",400)
      throw appErr
    }
   }
  
   const status = await approveDesignService(data,escapeHtml(id),next)

   if (!status) {
      const appErr = new AppError("Could not approve design, something went wrong","failed",400)
      throw appErr
   }
    const emailData ={
      email: status.designerEmail,
      status: status.status,
      name: status.designerName,
      designName: status.designName
    }
   //send mail via the email microservice
    //connect to rabbitmq and publish the message

   const channel = await connectRabbitMq()
   const exchangeName = "oneofone_exchange"
   const routingKey = "Email_approval"
   await channel.assertExchange(exchangeName, "direct", {durable:true})
   channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(emailData)))

   res.status(200).json("submission status changed")
 } catch (error) {
   return next(error)
 }
}



const getSubmissionsController =async(req,res,next)=>{
  try {
    const submission = await getSubmissionsService(next)
    if (!submission) {
      const appErr = new AppError("Could not approve design, something went wrong","failed",400)
      throw appErr
    }
    res.status(200).json(submission)
  } catch (error) {
    return next(error)
  }
}

const getSubmissionById =async(req,res,next)=>{
 try {
   const id = req.params.id
   const submission = await getSubmissionById(escapeHtml(id),req,next)
   if (!submission) {
    const appErr = new AppError("Error fetching this submission","failed",400)
    throw appErr
   }
   res.status(200).json(submission)
 } catch (error) {
   next(error)
 }
}
module.exports={submitController,approveDesignController,getSubmissionsController,getSubmissionById}