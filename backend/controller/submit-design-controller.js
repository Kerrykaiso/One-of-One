const { connectRabbitMq } = require("../config/rabbitmq-config");
const { checkDesignerTier } = require("../services/designer-profile");
const { submitDesignService, approveDesignService,getSubmissionsService, createProductFromSubmission, getAcceptedDesigns } = require("../services/submit-design");
const { checkWalletBalance, debitWallet } = require("../services/wallet-service");
const AppError = require("../utils/appError");
const { escapeHtml } = require("../utils/emailUtils");

const submitController=async(req,res,next)=>{
 try {
  const color = req.body.color
  const price = req.body.price
  const category = req.body.category
  const designName =req.body.designName
  const size = req.body.size
   const userData = req.data
   const mockupImages = req.files["mockups"]
   const designImages = req.files["designs"]
    const submitSuccess = await submitDesignService(mockupImages,designImages,userData,color,designName,price,category,size,next)
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
   //send event for creating product
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

const getApprovedSubmissions = async(req,res,next)=>{
 try {
  const approvedSubmissions = await getAcceptedDesigns(next)

  if (!approvedSubmissions) {
    const err = new AppError("Error fetching approved submissios", "failed",400)
      throw err
  }
  res.status(200).json(approvedSubmissions)
 } catch (error) {
   next(error)
 }
}

const createProductController=async(req,res,next)=>{
  try {
    const id = req.params
    const productImages = req.files["shirts"]

    const createProductData = await createProductFromSubmission(id,productImages,next)
    
    if (!createProductData) {
      const err = new AppError("Error creating product", "failed",400)
      throw err
    }

    const emailData = {
      status: createProductData.status,
      designerEmail: createProductData.designerEmail,
      designName: createProductData.name
    }
    
    const channel = await connectRabbitMq()
    const exchangeName = "oneofone_exchange"
    
    await channel.assertExchange(exchangeName, "direct", {durable:true})
    channel.publish(exchangeName, "Email_approval", Buffer.from(JSON.stringify(emailData)))
    channel.publish(exchangeName, "Create_product", Buffer.from(JSON.stringify(createProductData)))

   res.status(200).json("Product created")
  } catch (error) {
    next(error)
  }
}
module.exports={createProductController,submitController,getApprovedSubmissions,approveDesignController,getSubmissionsController,getSubmissionById}